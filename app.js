const Octokit = require('@octokit/rest')

exports.lambdaHandler = async (event, context) => {
  // console.log(process.env.TOKEN)

  // Initialize Github API client with a personal token from env
  const octokit = new Octokit({
    auth: process.env.TOKEN
  })

  // Parse request body
  const eventBody = JSON.parse(event.body)
  const title = eventBody.title
  const body  = eventBody.body
  const label = eventBody.label

  if (! title) {
    return {
      'statusCode': 400,
      'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
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
      'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      'body': JSON.stringify({
          error: 'Failed to create issue.',
          reason: err
        }
      )
    }
  }

  console.info(octoResponse)
  return {
    'statusCode': 204,
    'headers': {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  }
};
