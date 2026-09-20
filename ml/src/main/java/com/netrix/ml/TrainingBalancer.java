package com.netrix.ml;

import org.apache.commons.csv.*;

import java.io.*;
import java.nio.file.*;
import java.util.*;

public class TrainingBalancer {

    private static final Path INPUT =
            Path.of("data", "processed", "train.csv");

    private static final Path OUTPUT =
            Path.of("data", "processed", "train_balanced.csv");

    private static final int LABEL_INDEX = 78;

    private static final Random RANDOM = new Random(42);

    /*
     * Target number of training records.
     *
     * Large classes stay unchanged.
     * Minority classes are oversampled.
     */
    private static final Map<String, Integer> TARGETS =
            Map.of(
                    "BENIGN", 80000,
                    "DDoS", 80000,
                    "DoS", 80000,
                    "PortScan", 80000,
                    "BruteForce", 12000,
                    "Bot", 10000,
                    "WebAttack", 10000
            );

    public static void main(String[] args) {

        System.out.println("==============================");
        System.out.println(" NETRIX TRAINING BALANCER");
        System.out.println("==============================");

        try {

            Map<String, List<String[]>> data =
                    loadTrainingData();

            printCounts("Original training distribution", data);

            balance(data);

            printCounts("Balanced training distribution", data);

            writeBalancedDataset(data);

            System.out.println();
            System.out.println(
                    "Created: " + OUTPUT.toAbsolutePath()
            );

        } catch (Exception e) {

            System.err.println("Balancing failed:");
            e.printStackTrace();
        }
    }


    private static Map<String, List<String[]>>
    loadTrainingData() throws Exception {

        Map<String, List<String[]>> data =
                new LinkedHashMap<>();

        for (String label : TARGETS.keySet()) {
            data.put(label, new ArrayList<>());
        }

        try (
                Reader reader = Files.newBufferedReader(INPUT);

                CSVParser parser =
                        CSVFormat.DEFAULT.builder()
                                .setHeader()
                                .setSkipHeaderRecord(true)
                                .get()
                                .parse(reader)
        ) {

            for (CSVRecord record : parser) {

                if (record.size() != 79) {
                    continue;
                }

                String label =
                        record.get(LABEL_INDEX).trim();

                if (!data.containsKey(label)) {
                    continue;
                }

                String[] row =
                        new String[record.size()];

                for (int i = 0; i < record.size(); i++) {
                    row[i] = record.get(i);
                }

                data.get(label).add(row);
            }
        }

        return data;
    }


    private static void balance(
            Map<String, List<String[]>> data
    ) {

        for (Map.Entry<String, Integer> target :
                TARGETS.entrySet()) {

            String label = target.getKey();
            int targetSize = target.getValue();

            List<String[]> rows = data.get(label);

            if (rows.isEmpty()) {
                System.out.println(
                        "No records found for " + label
                );
                continue;
            }

            /*
             * If the class is larger than target,
             * randomly undersample.
             */
            if (rows.size() > targetSize) {

                Collections.shuffle(rows, RANDOM);

                List<String[]> reduced =
                        new ArrayList<>(
                                rows.subList(0, targetSize)
                        );

                data.put(label, reduced);

                continue;
            }

            /*
             * Minority class:
             * sample existing records with replacement.
             */
            List<String[]> original =
                    new ArrayList<>(rows);

            while (rows.size() < targetSize) {

                String[] selected =
                        original.get(
                                RANDOM.nextInt(original.size())
                        );

                rows.add(
                        Arrays.copyOf(
                                selected,
                                selected.length
                        )
                );
            }

            Collections.shuffle(rows, RANDOM);
        }
    }


    private static void writeBalancedDataset(
            Map<String, List<String[]>> data
    ) throws Exception {

        List<String> headers;

        try (
                Reader reader = Files.newBufferedReader(INPUT);

                CSVParser parser =
                        CSVFormat.DEFAULT.builder()
                                .setHeader()
                                .setSkipHeaderRecord(true)
                                .get()
                                .parse(reader)
        ) {

            headers = parser.getHeaderNames();
        }

        List<String[]> allRows =
                new ArrayList<>();

        for (List<String[]> rows : data.values()) {
            allRows.addAll(rows);
        }

        Collections.shuffle(allRows, RANDOM);

        try (
                BufferedWriter writer =
                        Files.newBufferedWriter(OUTPUT);

                CSVPrinter printer =
                        new CSVPrinter(
                                writer,
                                CSVFormat.DEFAULT
                        )
        ) {

            printer.printRecord(headers);

            for (String[] row : allRows) {

                printer.printRecord(
                        (Object[]) row
                );
            }
        }
    }


    private static void printCounts(
            String title,
            Map<String, List<String[]>> data
    ) {

        System.out.println();
        System.out.println(title + ":");

        long total = 0;

        for (String label :
                new TreeSet<>(data.keySet())) {

            int count =
                    data.get(label).size();

            total += count;

            System.out.printf(
                    "%-12s : %,d%n",
                    label,
                    count
            );
        }

        System.out.printf(
                "TOTAL        : %,d%n",
                total
        );
    }
}