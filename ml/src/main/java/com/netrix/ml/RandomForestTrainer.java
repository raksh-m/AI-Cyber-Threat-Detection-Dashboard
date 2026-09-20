package com.netrix.ml;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import smile.classification.RandomForest;
import smile.data.DataFrame;
import smile.data.Tuple;
import smile.data.formula.Formula;

import java.io.Reader;

// ======================================================
// NEW CHANGE: Imports required for saving trained model
// ======================================================
import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.ObjectOutputStream;
// ================= END CHANGE =========================

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

public class RandomForestTrainer {

    // ==========================================
    // FILE PATHS
    // ==========================================

    private static final Path TRAIN_FILE =
            Path.of("data", "processed", "train_balanced.csv");

    private static final Path TEST_FILE =
            Path.of("data", "processed", "test.csv");

    // ==========================================
    // DATASET CONFIGURATION
    // ==========================================

    private static final int FEATURE_COUNT = 78;
    private static final int LABEL_INDEX = 78;

    // ==========================================
    // LABEL -> INTEGER MAPPING
    // ==========================================

    private static final Map<String, Integer> LABEL_TO_ID =
            Map.of(
                    "BENIGN", 0,
                    "DDoS", 1,
                    "DoS", 2,
                    "PortScan", 3,
                    "BruteForce", 4,
                    "Bot", 5,
                    "WebAttack", 6
            );

    // ==========================================
    // INTEGER -> LABEL MAPPING
    // ==========================================

    private static final String[] ID_TO_LABEL = {
            "BENIGN",
            "DDoS",
            "DoS",
            "PortScan",
            "BruteForce",
            "Bot",
            "WebAttack"
    };


    // ==========================================
    // MAIN METHOD
    // ==========================================

    public static void main(String[] args) {

        System.out.println("==================================");
        System.out.println(" NETRIX RANDOM FOREST TRAINER");
        System.out.println("==================================");

        try {

            // ==========================================
            // LOAD TRAINING DATA
            // ==========================================

            System.out.println("\nLoading train_balanced.csv...");

            Dataset train = loadDataset(TRAIN_FILE);

            System.out.println(
                    "Training records: " + train.x.length
            );

            System.out.println(
                    "Features: " + FEATURE_COUNT
            );


            // ==========================================
            // LOAD TEST DATA
            // ==========================================

            System.out.println("\nLoading test.csv...");

            Dataset test = loadDataset(TEST_FILE);

            System.out.println(
                    "Test records: " + test.x.length
            );


            // ==========================================
            // CREATE SMILE DATAFRAME
            // ==========================================

            System.out.println(
                    "\nCreating Smile DataFrame..."
            );

            DataFrame trainData =
                    createTrainingDataFrame(train);

            Formula formula =
                    Formula.lhs("ThreatClass");


            // ==========================================
            // TRAIN RANDOM FOREST
            // ==========================================

            System.out.println(
                    "\nTraining Random Forest..."
            );

            long start = System.currentTimeMillis();

            RandomForest model =
                    RandomForest.fit(
                            formula,
                            trainData
                    );

            long end = System.currentTimeMillis();

            System.out.println(
                    "Training completed."
            );

            System.out.printf(
                    "Training time: %.2f seconds%n",
                    (end - start) / 1000.0
            );


            // ======================================================
            // NEW CHANGE: SAVE THE TRAINED RANDOM FOREST MODEL
            // ======================================================
            //
            // Previously the model existed only while this Java
            // program was running.
            //
            // Now we save it so ThreatPredictor.java and later the
            // backend can load it without training again.
            // ======================================================

            saveModel(model);

            // ================= END CHANGE =========================


            // ==========================================
            // EVALUATE MODEL
            // ==========================================

            evaluate(model, test);

        } catch (Exception e) {

            System.err.println(
                    "\nTraining failed:"
            );

            e.printStackTrace();
        }
    }


    // ==========================================
    // LOAD CSV
    // ==========================================

    private static Dataset loadDataset(Path file)
            throws Exception {

        List<double[]> featureRows =
                new ArrayList<>();

        List<Integer> labelRows =
                new ArrayList<>();

        try (
                Reader reader =
                        Files.newBufferedReader(file);

                CSVParser parser =
                        CSVFormat.DEFAULT.builder()
                                .setHeader()
                                .setSkipHeaderRecord(true)
                                .get()
                                .parse(reader)
        ) {

            for (CSVRecord record : parser) {

                // CICIDS2017 processed CSV:
                // 78 features + 1 label = 79 columns

                if (record.size() != 79) {
                    continue;
                }

                double[] features =
                        new double[FEATURE_COUNT];

                boolean valid = true;

                // ==========================================
                // READ 78 NUMERIC FEATURES
                // ==========================================

                for (int i = 0;
                     i < FEATURE_COUNT;
                     i++) {

                    try {

                        double value =
                                Double.parseDouble(
                                        record.get(i).trim()
                                );

                        // Reject NaN and Infinity
                        if (!Double.isFinite(value)) {

                            valid = false;
                            break;
                        }

                        features[i] = value;

                    } catch (NumberFormatException e) {

                        valid = false;
                        break;
                    }
                }

                if (!valid) {
                    continue;
                }


                // ==========================================
                // READ LABEL
                // ==========================================

                String label =
                        record
                                .get(LABEL_INDEX)
                                .trim();

                Integer labelId =
                        LABEL_TO_ID.get(label);

                // Ignore unknown classes
                if (labelId == null) {
                    continue;
                }

                featureRows.add(features);
                labelRows.add(labelId);
            }
        }


        // ==========================================
        // CONVERT LISTS TO ARRAYS
        // ==========================================

        double[][] x =
                featureRows.toArray(
                        new double[0][]
                );

        int[] y =
                labelRows.stream()
                        .mapToInt(Integer::intValue)
                        .toArray();

        return new Dataset(x, y);
    }


    // ==========================================
    // CREATE TRAINING DATAFRAME
    // ==========================================

    private static DataFrame createTrainingDataFrame(
            Dataset dataset
    ) {

        int rows = dataset.x.length;

        /*
         * 78 features + 1 target column
         */

        double[][] matrix =
                new double[rows][FEATURE_COUNT + 1];

        for (int row = 0;
             row < rows;
             row++) {

            // Copy all 78 features

            System.arraycopy(
                    dataset.x[row],
                    0,
                    matrix[row],
                    0,
                    FEATURE_COUNT
            );

            // Add target class as final column

            matrix[row][FEATURE_COUNT] =
                    dataset.y[row];
        }


        // ==========================================
        // CREATE COLUMN NAMES
        // ==========================================

        String[] columnNames =
                new String[FEATURE_COUNT + 1];

        for (int i = 0;
             i < FEATURE_COUNT;
             i++) {

            columnNames[i] = "F" + i;
        }

        columnNames[FEATURE_COUNT] =
                "ThreatClass";


        // ==========================================
        // CREATE DATAFRAME
        // ==========================================

        DataFrame frame =
                DataFrame.of(
                        matrix,
                        columnNames
                );

        /*
         * RandomForest classification requires
         * the target to be an integer/categorical
         * column, not a continuous double target.
         */

        frame =
                frame.factorize("ThreatClass");

        return frame;
    }


    // ======================================================
    // NEW CHANGE: SAVE TRAINED RANDOM FOREST MODEL
    // ======================================================

    private static void saveModel(
            RandomForest model
    ) throws Exception {

        /*
         * Model will be stored inside:
         *
         * ml/models/
         */

        Path modelDirectory =
                Path.of("models");


        // ==========================================
        // CREATE models FOLDER IF NEEDED
        // ==========================================

        Files.createDirectories(
                modelDirectory
        );


        // ==========================================
        // MODEL FILE LOCATION
        // ==========================================

        Path modelPath =
                modelDirectory.resolve(
                        "netrix-random-forest.model"
                );


        // ==========================================
        // SAVE MODEL
        // ==========================================

        /*
         * ObjectOutputStream serializes the
         * trained RandomForest object.
         *
         * Later we can load this file instead
         * of training the Random Forest again.
         */

        try (
                ObjectOutputStream output =
                        new ObjectOutputStream(
                                new BufferedOutputStream(
                                        new FileOutputStream(
                                                modelPath.toFile()
                                        )
                                )
                        )
        ) {

            output.writeObject(model);
        }


        // ==========================================
        // SUCCESS MESSAGE
        // ==========================================

        System.out.println();

        System.out.println(
                "=================================="
        );

        System.out.println(
                " MODEL SAVED SUCCESSFULLY"
        );

        System.out.println(
                "=================================="
        );

        System.out.println(
                "Model location:"
        );

        System.out.println(
                modelPath.toAbsolutePath()
        );
    }

    // ================= END NEW CHANGE ======================


    // ==========================================
    // EVALUATE MODEL
    // ==========================================

    private static void evaluate(
            RandomForest model,
            Dataset test
    ) {

        System.out.println();

        System.out.println(
                "=================================="
        );

        System.out.println(
                " MODEL EVALUATION"
        );

        System.out.println(
                "=================================="
        );

        int numberOfClasses =
                ID_TO_LABEL.length;


        // ==========================================
        // CONFUSION MATRIX
        // ==========================================

        long[][] confusion =
                new long[numberOfClasses]
                        [numberOfClasses];


        // ==========================================
        // PREDICTION COUNTS
        // ==========================================

        long[] predictedCounts =
                new long[numberOfClasses];

        long correct = 0;


        /*
         * Build one DataFrame containing
         * all test features.
         *
         * This avoids creating a DataFrame
         * for every individual record.
         */

        String[] featureNames =
                new String[FEATURE_COUNT];

        for (int i = 0;
             i < FEATURE_COUNT;
             i++) {

            featureNames[i] = "F" + i;
        }


        DataFrame testFrame =
                DataFrame.of(
                        test.x,
                        featureNames
                );


        // ==========================================
        // PREDICT TEST DATA
        // ==========================================

        for (int i = 0;
             i < test.x.length;
             i++) {

            Tuple row =
                    testFrame.get(i);

            int predicted =
                    model.predict(row);

            int actual =
                    test.y[i];


            // ==========================================
            // CORRECT PREDICTION
            // ==========================================

            if (predicted == actual) {

                correct++;
            }


            // ==========================================
            // COUNT PREDICTED CLASSES
            // ==========================================

            predictedCounts[predicted]++;


            // ==========================================
            // UPDATE CONFUSION MATRIX
            // ==========================================

            confusion[actual][predicted]++;
        }


        // ==========================================
        // CALCULATE ACCURACY
        // ==========================================

        double accuracy =
                (double) correct /
                        test.x.length;


        System.out.printf(
                "%nAccuracy: %.2f%%%n",
                accuracy * 100
        );


        // ==========================================
        // PRINT PREDICTED TRAFFIC
        // ==========================================

        System.out.println();

        System.out.println(
                "Predicted traffic:"
        );

        long totalThreats = 0;

        for (int i = 0;
             i < numberOfClasses;
             i++) {

            System.out.printf(
                    "%-12s : %,d%n",
                    ID_TO_LABEL[i],
                    predictedCounts[i]
            );


            /*
             * Class 0 = BENIGN
             *
             * Every other class is considered
             * malicious/threat traffic.
             */

            if (i != 0) {

                totalThreats +=
                        predictedCounts[i];
            }
        }


        // ==========================================
        // PRINT SUMMARY
        // ==========================================

        System.out.println();

        System.out.printf(
                "Total traffic analyzed : %,d%n",
                test.x.length
        );

        System.out.printf(
                "BENIGN traffic         : %,d%n",
                predictedCounts[0]
        );

        System.out.printf(
                "Threats detected       : %,d%n",
                totalThreats
        );


        // ==========================================
        // PRINT PRECISION / RECALL / F1
        // ==========================================

        printMetrics(confusion);
    }


    // ==========================================
    // PRECISION / RECALL / F1
    // ==========================================

    private static void printMetrics(
            long[][] matrix
    ) {

        System.out.println();

        System.out.println(
                "Per-class performance:"
        );

        System.out.printf(
                "%-12s %-12s %-12s %-12s%n",
                "Class",
                "Precision",
                "Recall",
                "F1"
        );


        // ==========================================
        // CALCULATE METRICS FOR EACH CLASS
        // ==========================================

        for (int c = 0;
             c < ID_TO_LABEL.length;
             c++) {

            long tp =
                    matrix[c][c];

            long fp = 0;
            long fn = 0;

            for (int i = 0;
                 i < ID_TO_LABEL.length;
                 i++) {

                if (i != c) {

                    fp += matrix[i][c];

                    fn += matrix[c][i];
                }
            }


            // ==========================================
            // PRECISION
            // ==========================================

            double precision =
                    tp + fp == 0
                            ? 0.0
                            : (double) tp /
                            (tp + fp);


            // ==========================================
            // RECALL
            // ==========================================

            double recall =
                    tp + fn == 0
                            ? 0.0
                            : (double) tp /
                            (tp + fn);


            // ==========================================
            // F1 SCORE
            // ==========================================

            double f1 =
                    precision + recall == 0
                            ? 0.0
                            : 2.0 *
                            precision *
                            recall /
                            (precision + recall);


            System.out.printf(
                    "%-12s %-12.4f %-12.4f %-12.4f%n",
                    ID_TO_LABEL[c],
                    precision,
                    recall,
                    f1
            );
        }


        // ==========================================
        // PRINT CONFUSION MATRIX
        // ==========================================

        printConfusionMatrix(matrix);
    }


    // ==========================================
    // CONFUSION MATRIX
    // ==========================================

    private static void printConfusionMatrix(
            long[][] matrix
    ) {

        System.out.println();

        System.out.println(
                "Confusion Matrix"
        );

        System.out.println(
                "Rows = Actual, Columns = Predicted"
        );


        // ==========================================
        // COLUMN HEADERS
        // ==========================================

        System.out.printf(
                "%-12s",
                ""
        );

        for (String label : ID_TO_LABEL) {

            System.out.printf(
                    "%-12s",
                    label
            );
        }

        System.out.println();


        // ==========================================
        // MATRIX VALUES
        // ==========================================

        for (int actual = 0;
             actual < ID_TO_LABEL.length;
             actual++) {

            System.out.printf(
                    "%-12s",
                    ID_TO_LABEL[actual]
            );

            for (int predicted = 0;
                 predicted < ID_TO_LABEL.length;
                 predicted++) {

                System.out.printf(
                        "%-12d",
                        matrix[actual][predicted]
                );
            }

            System.out.println();
        }
    }


    // ==========================================
    // DATASET RECORD
    // ==========================================

    private record Dataset(
            double[][] x,
            int[] y
    ) {
    }
}