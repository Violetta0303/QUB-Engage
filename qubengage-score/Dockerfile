# Stage 1: Build the application
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy the pom.xml to fetch dependencies
COPY pom.xml .
# Fetch dependencies
RUN mvn dependency:resolve

# Copy source code
COPY src /app/src

# Build the application
RUN mvn package -DskipTests

# Stage 2: Run the application
FROM openjdk:17
WORKDIR /app

# Copy the built application JAR from the build stage
COPY --from=build /app/target/*.jar /app/app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
