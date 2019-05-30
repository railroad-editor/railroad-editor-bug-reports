const Octokit = require('@octokit/rest')

// Get Github personal token from env
const TOKEN = process.env.TOKEN


exports.lambdaHandler = async (event, context) => {
  const octokit = new Octokit({
    auth: TOKEN
  })

  // console.log(event)
  const eventBody = JSON.parse(event.body)
  const title = eventBody.title
  const body  = eventBody.body
  const label = eventBody.label

  let octoResponse
  try {
    octoResponse = await octokit.issues.create({
      owner: 'railroad-editor',
      repo: 'railroad-editor-bug-reports',
      title: title,
      body: body,
      labels: [label]
    })
  } catch (err) {
    console.error('Failed to create issue!')
    console.log(err);
    return err;
  }

  console.error('Created issue.')
  return {
    'statusCode': 200,
    'body': octoResponse
  }
};
