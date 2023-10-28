# GoodJob


[![Build Status](https://github.com/networkx/networkx/workflows/test/badge.svg?branch=main)](https://github.com/rubywu0604/GoodJob/actions)
![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)

GoodJob is a platform that analyzes job market trends of engineering, offering visualized statistical reports. Futhermore, It serves for engineers seeking job opportunities, assisting them in securing an ideal good job.

- [Website](https://www.get-good-job.com)
- [Video introduction](https://drive.google.com/file/d/1bH5sI9850xf-Kc5xNKoD5UrVQQ5g55DD/view)

## Table Of Contents
- [GoodJob](#goodjob)
  - [Table Of Contents](#table-of-contents)
  - [Architecture](#architecture)
  - [Features](#features)
    - [Job API](#job-api)
    - [Data Pipeline](#data-pipeline)
    - [Database/Storage](#databasestorage)
    - [Visualization](#visualization)
    - [Scheduling](#scheduling)
    - [Monitoring](#monitoring)
    - [CI/CD](#cicd)
  - [Contact](#contact)
  
## Architecture

![Architecture](views/image/architecture.jpg)


_[Top](#table-of-contents)_

## Features

### Job API

* **Protocol:** `https`

* **Host Name:** `www.get-good-job.com`

* **End Point:** 
  
  `/api/jobs` for All jobs  
  `/api/jobs/ios_engineer` for iOS Engineer jobs  
  `/api/jobs/android_engineer` for Android Engineer jobs  
  `/api/jobs/frontend_engineer` for Frontend Engineer jobs  
  `/api/jobs/backend_engineer` for Backend Engineer jobs  
  `/api/jobs/data_engineer` for Data Engineer jobs  
  `/api/jobs/data_analyst` for Data Analysis jobs  
  `/api/jobs/data_scientist` for Data Scientist jobs  
  `/api/jobs/dba` for Database Administrator jobs  

* **Method:** `GET`

_[Top](#table-of-contents)_

### Data Pipeline
  - Scraping
  - Cleaning

_[Top](#table-of-contents)_

### Database/Storage
  - MySQL Schema
  
    | Field | Data Type | Description | 
    | :---: | :---: | :--- |
    | id | Number | Job id. |
    | category | String | Job category. |
    | job_title | String | Job title. |
    | location | String | Job location. |
    | company | String | Employer (hiring company) of the job.  |
    | min_monthly_salary | String | Minimum monthly salary. |
    | max_monthly_salary | String | Maximum monthly salary. |
    | education | String | Required academic qualifications of the job. |
    | skills | String | Required skills of the job. |
    | experience | String | Required working experiences of the job. |
    | job_link | String | Source website link of the job. |
    | source_website | String | Source website name. |

  - S3

_[Top](#table-of-contents)_

### Visualization
  - 

_[Top](#table-of-contents)_

### Scheduling
  - 
_[Top](#table-of-contents)_
  
### Monitoring
  - PM2 - server monitor
  - ScrapyOps - data pipeline monitor

_[Top](#table-of-contents)_

### CI/CD

_[Top](#table-of-contents)_

## Contact

:mailbox: lksh20602@gmail.com

[![LinkedIn](https://img.shields.io/badge/LinkedIn-RubyWu-555555?logo=linkedin&labelColor=0A66C2)](https://www.linkedin.com/in/rubywu-140031206/)

_[Top](#table-of-contents)_