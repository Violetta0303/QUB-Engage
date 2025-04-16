# QUB-Engage: A Microservice-Based Student Engagement Analytics Platform

QUBEngage is a full-stack, distributed platform designed to monitor and analyze student engagement through modular microservices. Each service is deployed independently using modern DevOps practices (Docker, CI/CD, Rancher, Cloud Functions) and integrated through a dynamic reverse proxy. The system supports real-time data analysis, risk prediction, frontend failure handling, and service monitoring with alerting capabilities.

---

## Live Demo

Frontend Entry: [Live Frontend](http://qubengage-total.40381868.qpc.hal.davecutting.uk) 
Proxy Endpoint: [Proxy Router](http://qubengage-proxy.40381868.qpc.hal.davecutting.uk) 
Monitor Dashboard: [Monitoring UI](http://qubengage-monitor.40381868.qpc.hal.davecutting.uk/)

---

## Microservices Overview

| Service        | Language | Description                                                  | Live URL                                                     |
| -------------- | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Total**      | Python   | Calculates total attendance across sessions with input validation. | [View](http://qubengage-total.40381868.qpc.hal.davecutting.uk) |
| **Score**      | Java     | Computes a weighted engagement score using Spring Boot and MVC. | [View](http://qubengage-score.40381868.qpc.hal.davecutting.uk) |
| **Risk**       | JS/Node  | Evaluates student risk based on engagement score and cutoff threshold. | [View](http://qubengage-risk.40381868.qpc.hal.davecutting.uk) |
| **MeanMedian** | PHP      | Calculates mean and median attendance using Google Cloud Functions (FaaS). | [View](https://europe-west2-cloud-405120.cloudfunctions.net/qubengage-meanmedian) |

---

## Reverse Proxy

A dynamic reverse proxy built in PHP routes requests to each microservice using a central configuration file (`services.json`). Features include:

- Health checks and failover
- Dynamic endpoint reloading
- Transparent routing to clients

---

## Frontend Features

- AJAX-based real-time updates
- Dynamic service fallback using primary and alternate URLs
- Centralized error handling (`displayError`)
- Load-balanced GET requests with failover logic
- Integrated configuration via `config.js` and `alternate.js`

---

## Monitoring System

Implemented using Node.js with:

- Express backend with REST endpoints for service status
- Email alerts via Nodemailer on service failures or high latency
- Frontend dashboard for live status visualization
- Dockerized deployment for scalability

---

## Testing & CI/CD

Each microservice is tested independently with CI pipelines:

- `unittest` for Python
- `MockMvc` for Java
- `Jest` and `Supertest` for Node.js
- PHP unit tests for FaaS
- Monitoring test coverage with Chai & Sinon
- GitLab CI pipelines for all projects

---

## Project Structure

```bash
QUBEngage/
├── total/            # Flask microservice for total attendance
├── score/            # Spring Boot service for engagement score
├── risk/             # Node.js service for risk assessment
├── meanmedian/       # PHP FaaS for mean/median calculations
├── proxy/            # PHP reverse proxy with service health check
├── frontend/         # JavaScript frontend with failover logic
├── monitor/          # Node.js monitoring service with alerting
└── .gitlab-ci.yml    # Unified CI config per service