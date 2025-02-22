@Library("thor-shared-pipelines") _
def NODE_LABEL = 'generic';
def ENVIRONMENT = 'STAGE'
def WORKSPACE_DIR = '/var/jenkins/postman-on-jenkins'
def CURRENT_USER = null


pipeline {
  agent {
    node {
      label NODE_LABEL
      customWorkspace WORKSPACE_DIR
    }
  }

  options {
    ansiColor('xterm')
  }
  parameters {
    string(name: 'BRANCH', defaultValue: 'main', description: 'Enter the branch name which needs to be deployed into dev environment.')
    // string(name: 'JENKINS_TF_VERSION', defaultValue: '0.13.7', description: 'Enter the inteneded terraform version.')
    // string(name: 'KUBE_REGION', defaultValue: 'us-west-2', description: 'Enter the region to upgrade.')
  }

  stages {
    stage('Clone repository') {
      steps {
        sh "git checkout ${params.BRANCH}"
      }
    }

    stage('Use nodejs plugin') {
            steps {
                nodejs('nodejs 18.16') {
                    sh 'npm --version'
                    sh 'npm config set @opendns:registry https://engci-maven.cisco.com/artifactory/api/npm/umbrella-npm/ -g'
                    sh 'npm config ls'
                    sh 'npm install -g newman'
                }
            }
        }

    // stage('Install Newman') {
    //         steps {
    //             script {
    //                 // Install Newman globally
    //                 sh '''
    //                     mkdir "${HOME}/.npm-global"
    //                     npm config set prefix "${HOME}/.npm-global"
    //                     echo 'export PATH="$PATH:${HOME}/.npm-global/bin"' >> ~/.bashrc
    //                     source ~/.bashrc
    //                 '''
    //                 sh 'npm install -g newman'
    //             }
    //         }
    //     }

        stage('Run Postman Collection') {
            steps {
                script {
                    // Run your Postman collection using Newman
                    sh 'ls -ltrah'
                    sh 'newman run your-collection-file.json -r cli,junit --reporter-junit-export results.xml'
                }
            }
        }

        stage('Archive Test Results') {
            steps {
                // Archive the test result XML for reporting
                junit 'results.xml'
            }
        }

//      stage('Streamline-Login') {
//       steps {
//         script {
//            withCredentials([string(credentialsId: 'SL_PKI_REQUEST_ID', variable: 'SlBotReqId'),
//                         string(credentialsId: 'SL_PKI_DEPLOY_KEY', variable: 'SlBotDeployKey')]) {
//               sh "sl login --sl-pki-request-id $SlBotReqId --sl-pki-deploy-key $SlBotDeployKey"
//             }
//           sh "sl aws session generate --account-id ${AWS_ACCOUNT_ID} --role-name owner --profile strln > /dev/null 2>&1"

//         }
//       }
//     }

//     stage('Terraform Init') {
//       steps {
//         dir('common-service/cluster/stage/eks') {
//             withTerraformSwitcher(version: params.JENKINS_TF_VERSION) {
//                       sh "terraform --version"
//                       sh "terraform init -input=false"
//             }
//         }

//       }
//   }
//   stage('Terraform plan') {
//       steps {
//         script {
//           def userCause = currentBuild.rawBuild.getCause(hudson.model.Cause$UserIdCause)
//           if (userCause != null) {
//               CURRENT_USER = userCause.getUserId()
//           } else {
//               CURRENT_USER = 'SYSTEM' // When triggered by system or scheduled tasks
//           }

//           echo "Current User: ${CURRENT_USER}" //lp: test statement, remove

//           dir('common-service/cluster/stage/eks') {
//               withTerraformSwitcher(version: params.JENKINS_TF_VERSION) {
//                 sh "terraform plan -var last_revalidated_by=${CURRENT_USER} -target module.${params.KUBE_REGION}.module.eks -out=tfplan -input=false"
//               }
//           }
//         }
//       }
//   }
//   stage('User Approval') {
//       steps {
//         echo "Proceed applying terraform for EKS?:"
//         input(message: 'Proceed applying terraform for EKS?', ok: 'Yes',
//         parameters: [booleanParam(defaultValue: true,
//         description: 'This will apply changes in EKS terraform',name: 'Yes?')])
//       }
//   }
//   stage('Terraform apply') {
//       steps {
//         dir('common-service/cluster/stage/eks') {
//             withTerraformSwitcher(version: params.JENKINS_TF_VERSION) {
//               sh "terraform apply -var last_revalidated_by=${CURRENT_USER} -target module.${params.KUBE_REGION}.module.eks -input=false  -auto-approve"
//             }
//         }

//       }
//   }

  // stage('Trigger downstream External Secret Controller configuration (Identity Cluster) Job'){
  //     steps{
  //         script{
  //           build job:"External Secret Controller (Identity Cluster)",
  //           parameters: [
  //           string(name: 'ENV', value: ENVIRONMENT),
  //           string(name: 'BRANCH', value: params.BRANCH)
  //           ]
  //         }
  //     }
  // }

  //   stage('Trigger downstream Datadog Agent Deployment Job'){
  //     steps{
  //         script{
  //           build job:"Datadog Agent Deployment",
  //           parameters: [
  //           string(name: 'ENVIRONMENT', value: ENVIRONMENT),
  //           string(name: 'BRANCH', value: params.BRANCH),
  //           string(name: 'REGION', value: 'ALL')
  //           ]
  //         }
  //     }
  // }

}

  post {
		always {
			echo 'One way or another, Job is finished'
			deleteDir() /* clean up our workspace */
		}
		success {
			echo "success"
			// sparkSend credentialsId: 'identity-build-buddy', message: '**Success** - * Identity Stage EKS Cluster deployment from branch : ' + params.BRANCH + ' *: [${env.JOB_NAME} || ${env.BUILD_NUMBER}](${env.BUILD_URL})', messageType: 'markdown', spaceList: [
			// 	[spaceId: 'Y2lzY29zcGFyazovL3VybjpURUFNOnVzLWVhc3QtMl9hOmlkZW50aXR5TG9va3VwL1JPT00vM2FiMTc5MzAtNDQyYy0xMWU5LWJkNzEtZDk3NGU2MzdiZmVk', spaceName: 'Identity #Cluster#AD-ISS#GSuite#ADC#AzureAD']
			// ]
		}
		failure {
			echo "failure"
			// sparkSend credentialsId: 'identity-build-buddy', message: '**Failure** - * Identity Stage EKS Cluster deployment from branch : ' + params.BRANCH + ' *: [${env.JOB_NAME} || ${env.BUILD_NUMBER}](${env.BUILD_URL})', messageType: 'markdown', spaceList: [
			// 	[spaceId: 'Y2lzY29zcGFyazovL3VybjpURUFNOnVzLWVhc3QtMl9hOmlkZW50aXR5TG9va3VwL1JPT00vYTVjNDY0MDAtYzFjOS0xMWVhLTgxNDMtZjlhMDdjMGRkMWE0', spaceName: 'Identity #Cluster#AD-ISS#GSuite#ADC#AzureAD']
			// ]
		}
		aborted {
			echo "aborted"
					echo "failure"
			// sparkSend credentialsId: 'identity-build-buddy', message: '**Aborted** - * Identity Stage EKS Cluster deployment from branch : ' + params.BRANCH + ' *: [${env.JOB_NAME} || ${env.BUILD_NUMBER}](${env.BUILD_URL})', messageType: 'markdown', spaceList: [
			// 	[spaceId: 'Y2lzY29zcGFyazovL3VybjpURUFNOnVzLWVhc3QtMl9hOmlkZW50aXR5TG9va3VwL1JPT00vYTVjNDY0MDAtYzFjOS0xMWVhLTgxNDMtZjlhMDdjMGRkMWE0', spaceName: 'Identity #Cluster#AD-ISS#GSuite#ADC#AzureAD']
			// ]
		}
	}

}
