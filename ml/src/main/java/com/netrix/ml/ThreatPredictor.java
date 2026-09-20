package com.netrix.ml;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import smile.classification.RandomForest;
import smile.data.DataFrame;
import smile.data.Tuple;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.ObjectInputStream;
import java.io.Reader;

import java.nio.file.Files;
import java.nio.file.Path;

public class ThreatPredictor {

    private static final int FEATURE_COUNT = 78;

    // Saved Random Forest model
    private static final Path MODEL_FILE =
        Path.of("..", "ml", "models", "netrix-random-forest.model");
    // For now we test using test.csv
    private static final Path INPUT_FILE =
            Path.of("data", "processed", "test.csv");

    private static final String[] ID_TO_LABEL = {
            "BENIGN",
            "DDoS",
            "DoS",
            "PortScan",
            "BruteForce",
            "Bot",
            "WebAttack"
    };

    public static void main(String[] args) {

        System.out.println("==================================");
        System.out.println(" NETRIX THREAT PREDICTOR");
        System.out.println("==================================");

        try {

            // ==========================================
            // LOAD SAVED MODEL
            // ==========================================

            System.out.println("\nLoading trained model...");

            RandomForest model = loadModel();

            System.out.println("Model loaded successfully.");

            // ==========================================
            // ANALYZE CSV
            // ==========================================

            System.out.println("\nAnalyzing:");
            System.out.println(INPUT_FILE.toAbsolutePath());

            PredictionResult result =
                    predictFile(model, INPUT_FILE);

            // ==========================================
            // DISPLAY RESULTS
            // ==========================================

            printResults(result);

        } catch (Exception e) {

            System.err.println("\nPrediction failed:");
            e.printStackTrace();
        }
    }


    // ==========================================
    // LOAD SAVED RANDOM FOREST
    // ==========================================

    public static RandomForest loadModel()
            throws Exception {

        if (!Files.exists(MODEL_FILE)) {

            throw new IllegalStateException(
                    "Model file not found: "
                            + MODEL_FILE.toAbsolutePath()
            );
        }

        try (
                ObjectInputStream input =
                        new ObjectInputStream(
                                new BufferedInputStream(
                                        new FileInputStream(
                                                MODEL_FILE.toFile()
                                        )
                                )
                        )
        ) {

            Object object = input.readObject();

            if (!(object instanceof RandomForest)) {

                throw new IllegalStateException(
                        "Saved file does not contain a RandomForest model."
                );
            }

            return (RandomForest) object;
        }
    }


    // ==========================================
    // PREDICT CSV
    // ==========================================

    public static PredictionResult predictFile(
            RandomForest model,
            Path csvFile
    ) throws Exception {

        long[] counts =
                new long[ID_TO_LABEL.length];

        long totalRows = 0;
        long acceptedRows = 0;
        long invalidRows = 0;

        /*
         * We predict in batches instead of creating
         * one DataFrame for every individual record.
         */
        final int BATCH_SIZE = 5000;

        double[][] batch =
                new double[BATCH_SIZE][FEATURE_COUNT];

        int batchCount = 0;

        try (
                Reader reader =
                        Files.newBufferedReader(csvFile);

                CSVParser parser =
                        CSVFormat.DEFAULT.builder()
                                .setHeader()
                                .setSkipHeaderRecord(true)
                                .get()
                                .parse(reader)
        ) {

            for (CSVRecord record : parser) {

                totalRows++;

                /*
                 * test.csv contains:
                 *
                 * 78 features + label
                 *
                 * Future uploaded prediction files may
                 * contain either 78 or 79 columns.
                 */
                if (record.size() < FEATURE_COUNT) {

                    invalidRows++;
                    continue;
                }

                double[] features =
                        new double[FEATURE_COUNT];

                boolean valid = true;

                for (int i = 0;
                     i < FEATURE_COUNT;
                     i++) {

                    try {

                        double value =
                                Double.parseDouble(
                                        record.get(i).trim()
                                );

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

                    invalidRows++;
                    continue;
                }

                batch[batchCount] = features;
                batchCount++;

                if (batchCount == BATCH_SIZE) {

                    predictBatch(
                            model,
                            batch,
                            batchCount,
                            counts
                    );

                    acceptedRows += batchCount;

                    batch =
                            new double[BATCH_SIZE]
                                    [FEATURE_COUNT];

                    batchCount = 0;
                }
            }
        }


        // Predict remaining rows

        if (batchCount > 0) {

            predictBatch(
                    model,
                    batch,
                    batchCount,
                    counts
            );

            acceptedRows += batchCount;
        }


        return new PredictionResult(
                totalRows,
                acceptedRows,
                invalidRows,
                counts
        );
    }


    // ==========================================
    // PREDICT ONE BATCH
    // ==========================================

    private static void predictBatch(
            RandomForest model,
            double[][] batch,
            int size,
            long[] counts
    ) {

        double[][] actualBatch =
                new double[size][FEATURE_COUNT];

        System.arraycopy(
                batch,
                0,
                actualBatch,
                0,
                size
        );


        // Same feature names used during training

        String[] featureNames =
                new String[FEATURE_COUNT];

        for (int i = 0;
             i < FEATURE_COUNT;
             i++) {

            featureNames[i] = "F" + i;
        }


        DataFrame frame =
                DataFrame.of(
                        actualBatch,
                        featureNames
                );


        for (int i = 0;
             i < frame.size();
             i++) {

            Tuple row =
                    frame.get(i);

            int predicted =
                    model.predict(row);


            if (predicted >= 0 &&
                    predicted < counts.length) {

                counts[predicted]++;
            }
        }
    }


    // ==========================================
    // PRINT RESULTS
    // ==========================================

    private static void printResults(
            PredictionResult result
    ) {

        System.out.println();
        System.out.println("==================================");
        System.out.println(" THREAT ANALYSIS RESULT");
        System.out.println("==================================");

        long[] counts = result.counts();

        long totalThreats = 0;

        for (int i = 0;
             i < ID_TO_LABEL.length;
             i++) {

            System.out.printf(
                    "%-12s : %,d%n",
                    ID_TO_LABEL[i],
                    counts[i]
            );

            // Everything except BENIGN is a threat
            if (i != 0) {

                totalThreats += counts[i];
            }
        }

        System.out.println();

        System.out.printf(
                "Rows received     : %,d%n",
                result.totalRows()
        );

        System.out.printf(
                "Traffic analyzed  : %,d%n",
                result.acceptedRows()
        );

        System.out.printf(
                "Invalid rows      : %,d%n",
                result.invalidRows()
        );

        System.out.printf(
                "Benign traffic    : %,d%n",
                counts[0]
        );

        System.out.printf(
                "Threats detected  : %,d%n",
                totalThreats
        );
    }


    // ==========================================
    // PREDICTION RESULT
    // ==========================================

    public record PredictionResult(
            long totalRows,
            long acceptedRows,
            long invalidRows,
            long[] counts
    ) {
    }
    public static PredictionResult analyzeTestFile() throws Exception {

    RandomForest model = loadModel();

    return predictFile(model, INPUT_FILE);

}
   public static PredictionResult analyzeFile(Path csvFile) throws Exception {

    RandomForest model = loadModel();

    return predictFile(model, csvFile);
}
}