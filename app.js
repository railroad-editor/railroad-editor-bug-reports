const Octokit = require('@octokit/rest')

// Get Github personal token from env
const TOKEN = process.env.TOKEN


exports.lambdaHandler = async (event, context) => {
  // console.log(event)

  // Initialize Github API client
  const octokit = new Octokit({
    auth: TOKEN
  })

  // Parse request body
  const eventBody = JSON.parse(event.body)
  const title = eventBody.title
  const body  = eventBody.body
  const label = eventBody.label

  if (! title) {
    return {
      'statusCode': 400,
      'body': JSON.stringify({
        error: 'Failed to create issue.',
        reason: 'Title cannot be null.'
      })
    }
  }

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
    console.error(err);
    return {
      'statusCode': 500,
      'body': JSON.stringify({
          error: 'Failed to create issue.',
          reason: err
        }
      )
    }
  }

  console.info(octoResponse)
  return {
    'statusCode': 204
  }
};
