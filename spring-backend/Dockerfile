# STAGE 1: Build the JAR (using Maven)
FROM maven:3.8.5-openjdk-17 AS build_stage
WORKDIR /app
COPY . .
# This creates the JAR inside the /app/target folder of this stage
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# STAGE 2: Run the JAR (using JDK)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# IMPORTANT: Pull the JAR from the previous 'build_stage'
COPY --from=build_stage /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]