pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'react-app-image'
        NETLIFY_AUTH_TOKEN = credentials('nfp_LwS7bbdd2oR3KRDbjXiBkaZFdCordmcg639c')
        NETLIFY_SITE_ID = '023ed5da-c7ca-4f9e-b163-aa582332b436'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker Image...'
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Simulating Security Scan (No actual scan performed)...'
            }
        }

        stage('Run App in Docker') {
            steps {
                script {
                    echo 'Running app in Docker container...'
                    sh 'docker rm -f react-app-container || true'
                    sh 'docker run -d -p 3000:3000 --memory=1g --name react-app-container $DOCKER_IMAGE npm start'
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                sh 'npm run test'  // Adjust the path to your tests as necessary
            }
        }

        stage('Build React App') {
            steps {
                echo 'Building React App for production...'
                sh 'npm run build' // This will generate the ./build directory
            }
        }

        stage('Deploy to Netlify') {
            steps {
                echo 'Deploying to Netlify...'
                sh '''
                netlify deploy --prod \
                --auth $NETLIFY_AUTH_TOKEN \
                --site $NETLIFY_SITE_ID \
                --dir ./build
                '''
            }
        }

        stage('Monitor with Datadog') {
            steps {
                echo 'Monitoring application in production...'
                sh '''
                curl -X POST -H "Content-type: application/json" \
                -d '{
                     "series" : [{
                         "metric":"myapp.deployment",
                         "points":[[ $(date +%s), 1 ]],
                         "type":"count",
                         "tags":["env:production"]
                      }]
                   }' \
                "https://api.datadoghq.com/api/v1/series?api_key=ea0f57a0c8592dfa68304fdaa53ee3b1"
                '''
            }
        }

        stage('Release to Production') {  
            steps {
                script {
                    echo 'Releasing application using Docker Compose...'
                    sh 'docker-compose up -d --build'  // Rebuild and release services
                }
            }
        }

        stage('Mail Notification') {
            steps {
                mail to: 'palakbedi2004@gmail.com',
                     subject: "Build Successful: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                     body: "Good news! The build for project ${env.JOB_NAME} [${env.BUILD_NUMBER}] completed successfully."
            }
        }
    }

    post {
        failure {
            echo 'Build, tests, or deployment failed!'
            script {
                sh 'docker logs react-app-container || true'
            }
            mail to: 'palakbedi2004@gmail.com',
                 subject: "Build Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                 body: "The build for project ${env.JOB_NAME} [${env.BUILD_NUMBER}] has failed. Please check the logs."
        }
    }
}
