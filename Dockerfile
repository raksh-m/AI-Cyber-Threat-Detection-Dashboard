# ==============================
# Build stage
# ==============================
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy root Maven configuration and modules
COPY pom.xml .
COPY ml/pom.xml ml/pom.xml
COPY Backend/pom.xml Backend/pom.xml

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY ml ml
COPY Backend/src Backend/src

# Build the complete Maven project
RUN mvn -pl Backend -am clean package -DskipTests

# ==============================
# Runtime stage
# ==============================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the generated backend JAR
COPY --from=build /app/Backend/target/*.jar app.jar

# Copy ML files if required at runtime
COPY --from=build /app/ml /app/ml

# Render assigns the service port
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]