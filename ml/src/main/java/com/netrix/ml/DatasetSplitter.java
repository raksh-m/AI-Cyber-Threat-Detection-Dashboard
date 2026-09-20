package com.netrix.ml;

import org.apache.commons.csv.*;

import java.io.*;
import java.nio.file.*;
import java.util.*;

public class DatasetSplitter {

    private static final Path INPUT =
            Path.of("data", "processed", "cicids2017_cleaned.csv");

    private static final Path TRAIN =
            Path.of("data", "processed", "train.csv");

    private static final Path TEST =
            Path.of("data", "processed", "test.csv");

    private static final int LABEL_INDEX = 78;

    private static final Random RANDOM = new Random(42);

    private static final Map<String, Integer> LIMITS = Map.of(
            "BENIGN", 100000,
            "DoS", 100000,
            "PortScan", 100000,
            "DDoS", 100000,
            "BruteForce", 15000,
            "Bot", 1500,
            "WebAttack", 500
    );

    public static void main(String[] args) {

        Map<String, List<String[]>> samples = new HashMap<>();

        for (String label : LIMITS.keySet()) {
            samples.put(label, new ArrayList<>());
        }

        try (
                Reader reader = Files.newBufferedReader(INPUT);

                CSVParser parser = CSVFormat.DEFAULT.builder()
                        .setHeader()
                        .setSkipHeaderRecord(true)
                        .get()
                        .parse(reader)
        ) {

            List<String> headers = parser.getHeaderNames();

            Map<String, Integer> seen = new HashMap<>();

            for (CSVRecord record : parser) {

                String label = record.get(LABEL_INDEX).trim();

                if (!LIMITS.containsKey(label)) {
                    continue;
                }

                int currentSeen =
                        seen.merge(label, 1, Integer::sum);

                List<String[]> reservoir = samples.get(label);

                int limit = LIMITS.get(label);

                String[] row = new String[record.size()];

                for (int i = 0; i < record.size(); i++) {
                    row[i] = record.get(i);
                }

                // Reservoir sampling
                if (reservoir.size() < limit) {

                    reservoir.add(row);

                } else {

                    int position =
                            RANDOM.nextInt(currentSeen);

                    if (position < limit) {
                        reservoir.set(position, row);
                    }
                }
            }

            writeDatasets(headers, samples);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private static void writeDatasets(
            List<String> headers,
            Map<String, List<String[]>> samples
    ) throws Exception {

        try (
                BufferedWriter trainWriter =
                        Files.newBufferedWriter(TRAIN);

                BufferedWriter testWriter =
                        Files.newBufferedWriter(TEST);

                CSVPrinter trainPrinter =
                        new CSVPrinter(trainWriter, CSVFormat.DEFAULT);

                CSVPrinter testPrinter =
                        new CSVPrinter(testWriter, CSVFormat.DEFAULT)
        ) {

            trainPrinter.printRecord(headers);
            testPrinter.printRecord(headers);

            System.out.println("================================");
            System.out.println(" DATASET SPLIT");
            System.out.println("================================");

            for (String label : new TreeSet<>(samples.keySet())) {

                List<String[]> rows = samples.get(label);

                Collections.shuffle(rows, RANDOM);

                int trainSize =
                        (int) (rows.size() * 0.80);

                int testSize =
                        rows.size() - trainSize;

                for (int i = 0; i < rows.size(); i++) {

                    if (i < trainSize) {
                        trainPrinter.printRecord(
                                (Object[]) rows.get(i)
                        );
                    } else {
                        testPrinter.printRecord(
                                (Object[]) rows.get(i)
                        );
                    }
                }

                System.out.println(
                        label +
                        " -> Train: " + trainSize +
                        " | Test: " + testSize
                );
            }

            System.out.println();
            System.out.println("train.csv created.");
            System.out.println("test.csv created.");
        }
    }
}