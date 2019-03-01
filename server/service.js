const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init();

const assistant = new AssistantV1({
  iam_apikey: IBMCloudEnv.getString('watson_conversation_apikey'),
  username: IBMCloudEnv.getString('watson_conversation_username'),
  password: IBMCloudEnv.getString('watson_conversation_password'),
  url: IBMCloudEnv.getString('watson_conversation_url'),
  version: '2018-07-10',
});

let workspaceId = null;
const MAX_RETRIES = 3;

/**
 * Create an assistant workspace based on training file provided
 * @param {Object} assistant Instance provided for Assistant to use
 * @param {Integer} retryCount Number of retries in case of failure
 * @param {Object} trainingFile Config file used to create workspace
 */
const createWorkspace = (assistant, retryCount, trainingFile) => {
  assistant.createWorkspace(trainingFile, function(err, response) {
    if (err) {
      if (retryCount > 1) {
        --retryCount;
        createWorkspace(assistant, retryCount, trainingFile);
      } else {
        console.log('Can not create workspace! Please go to Launch Tool provided in starter kits app page to create workspace manually');
      }
    } else {
      workspaceId = response.workspace_id;
      console.log(`Workspace has been created (${workspaceId})`);
    }
  });
};


/**
 * Creates a workspace or use an existing one
*/
assistant.listWorkspaces(function(err, response) {
  if (err) {
    console.log(err);
    return;
  } else if (response.workspaces.length > 0) {
    workspaceId = response.workspaces[0].workspace_id;
    console.log('Using workspace:', workspaceId);
  } else {
    console.log('Creating a workspace...');
    createWorkspace(assistant, MAX_RETRIES, require('../training/car_training.json'));
  }
});



module.exports = {
  getAssistantV1: () => assistant,
  getWorkspaceId: () => workspaceId,
}