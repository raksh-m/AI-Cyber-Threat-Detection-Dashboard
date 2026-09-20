package com.netrix.ml;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;

import java.io.BufferedWriter;
import java.io.Reader;
import java.nio.file.*;
import java.util.*;

public class DataPreprocessor {

    private static final Path RAW_FOLDER =
            Path.of("data", "raw");

    private static final Path OUTPUT_FILE =
            Path.of(
                    "data",
                    "processed",
                    "cicids2017_cleaned.csv"
            );

    private static final int EXPECTED_COLUMNS = 79;

    // CICIDS2017 label is the last column
    private static final int LABEL_INDEX = 78;

    public static void main(String[] args) {

        System.out.println("==================================");
        System.out.println(" Netrix CICIDS2017 Preprocessor");
        System.out.println("==================================");

        try {

            Files.createDirectories(
                    OUTPUT_FILE.getParent()
            );

            List<Path> csvFiles;

            try (var stream = Files.list(RAW_FOLDER)) {

                csvFiles = stream
                        .filter(Files::isRegularFile)
                        .filter(path ->
                                path.getFileName()
                                        .toString()
                                        .toLowerCase()
                                        .endsWith(".csv"))
                        .sorted()
                        .toList();
            }

            System.out.println(
                    "CSV files found: " + csvFiles.size()
            );

            if (csvFiles.isEmpty()) {
                System.out.println("No CSV files found.");
                return;
            }

            processFiles(csvFiles);

        } catch (Exception e) {

            System.err.println(
                    "Preprocessing failed:"
            );

            e.printStackTrace();
        }
    }


    private static void processFiles(
            List<Path> files
    ) throws Exception {

        long totalRows = 0;
        long acceptedRows = 0;

        long malformedRows = 0;
        long invalidNumericRows = 0;
        long excludedLabels = 0;

        Map<String, Long> classCounts =
                new TreeMap<>();

        boolean headerWritten = false;

        try (
                BufferedWriter writer =
                        Files.newBufferedWriter(
                                OUTPUT_FILE,
                                StandardOpenOption.CREATE,
                                StandardOpenOption.TRUNCATE_EXISTING
                        );

                CSVPrinter printer =
                        new CSVPrinter(
                                writer,
                                CSVFormat.DEFAULT
                        )
        ) {

            for (Path file : files) {

                System.out.println();
                System.out.println(
                        "Processing: "
                                + file.getFileName()
                );

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

                    /*
                     * getHeaderNames() preserves the
                     * original 79 header positions.
                     */
                    List<String> originalHeaders =
                            parser.getHeaderNames();

                    if (originalHeaders.size()
                            != EXPECTED_COLUMNS) {

                        System.out.println(
                                "Unexpected header count: "
                                        + originalHeaders.size()
                        );

                        System.out.println(
                                "Skipping file."
                        );

                        continue;
                    }

                    if (!headerWritten) {

                        for (int i = 0;
                             i < originalHeaders.size();
                             i++) {

                            String header =
                                    originalHeaders
                                            .get(i)
                                            .trim();

                            /*
                             * CICIDS2017 contains
                             * Fwd Header Length twice.
                             *
                             * Give duplicate column 55
                             * a unique output name.
                             */
                            if (i == 55) {
                                header =
                                        "Fwd Header Length Duplicate";
                            }

                            printer.print(header);
                        }

                        printer.println();

                        headerWritten = true;
                    }

                    for (CSVRecord record : parser) {

                        totalRows++;

                        if (record.size()
                                != EXPECTED_COLUMNS) {

                            malformedRows++;
                            continue;
                        }

                        String originalLabel =
                                record
                                        .get(LABEL_INDEX)
                                        .trim();

                        String mappedLabel =
                                mapLabel(originalLabel);

                        if (mappedLabel == null) {

                            excludedLabels++;
                            continue;
                        }

                        boolean valid = true;

                        String[] cleaned =
                                new String[
                                        EXPECTED_COLUMNS
                                ];

                        for (int i = 0;
                             i < EXPECTED_COLUMNS;
                             i++) {

                            if (i == LABEL_INDEX) {

                                cleaned[i] =
                                        mappedLabel;

                                continue;
                            }

                            String value =
                                    record.get(i).trim();

                            if (!isValidNumber(value)) {

                                valid = false;
                                break;
                            }

                            cleaned[i] = value;
                        }

                        if (!valid) {

                            invalidNumericRows++;
                            continue;
                        }

                        for (String value : cleaned) {
                            printer.print(value);
                        }

                        printer.println();

                        acceptedRows++;

                        classCounts.merge(
                                mappedLabel,
                                1L,
                                Long::sum
                        );
                    }
                }
            }
        }

        System.out.println();
        System.out.println("==================================");
        System.out.println(" PREPROCESSING COMPLETE");
        System.out.println("==================================");

        System.out.println(
                "Total rows read: "
                        + totalRows
        );

        System.out.println(
                "Accepted rows: "
                        + acceptedRows
        );

        System.out.println(
                "Malformed rows: "
                        + malformedRows
        );

        System.out.println(
                "Invalid numeric rows: "
                        + invalidNumericRows
        );

        System.out.println(
                "Excluded labels: "
                        + excludedLabels
        );

        System.out.println();
        System.out.println("Class distribution:");

        classCounts.forEach(
                (label, count) ->
                        System.out.println(
                                label + " = " + count
                        )
        );

        System.out.println();
        System.out.println(
                "Output: "
                        + OUTPUT_FILE.toAbsolutePath()
        );
    }


    private static boolean isValidNumber(
            String value
    ) {

        if (value == null || value.isBlank()) {
            return false;
        }

        try {

            double number =
                    Double.parseDouble(value);

            return Double.isFinite(number);

        } catch (NumberFormatException e) {

            return false;
        }
    }


    private static String mapLabel(
            String label
    ) {

        String normalized =
                label.trim()
                        .replace('–', '-')
                        .replace('—', '-')
                        .replaceAll("\\s+", " ");

        String lower =
                normalized.toLowerCase();

        if (lower.equals("benign")) {
            return "BENIGN";
        }

        if (lower.equals("ddos")) {
            return "DDoS";
        }

        if (lower.equals("dos hulk")
                || lower.equals("dos goldeneye")
                || lower.equals("dos slowloris")
                || lower.equals("dos slowhttptest")) {

            return "DoS";
        }

        if (lower.equals("ftp-patator")
                || lower.equals("ssh-patator")) {

            return "BruteForce";
        }

        if (lower.contains("web attack")
                && lower.contains("brute force")) {

            return "BruteForce";
        }

        if (lower.equals("portscan")) {
            return "PortScan";
        }

        if (lower.equals("bot")) {
            return "Bot";
        }

        if (lower.contains("web attack")
                && (
                    lower.contains("xss")
                    || lower.contains("sql injection")
                )) {

            return "WebAttack";
        }

        /*
         * Version 1:
         * Heartbleed and Infiltration excluded.
         */
        return null;
    }
}