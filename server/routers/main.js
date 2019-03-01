const service = require('../service');

module.exports = function(app) {
  /**
   * Endpoint to be call from the client side
   */
  app.post('/api/message', function(req, res) {
    if (!service.getWorkspaceId()) {
      return res.json({
        output: {
          text: 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the Application Checklist in the Watson Console documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from the training file (<code>training/car_workspace.json</code>) in order to get a working application.'
        }
      });
    }
    const payload = {
      workspace_id: service.getWorkspaceId(),
      context: req.body.context || {},
      input: req.body.input || {}
    };

    // Send the input to the assistant service
    service.getAssistantV1().message(payload, function(err, data) {
      if (err) {
        return res.status(err.code || 500).json(err);
      }
      return res.json(data);
    });
  });
}
