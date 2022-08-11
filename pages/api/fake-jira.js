import jira from './jira.json'

export default function handler(req, res) {
  if (req.method === 'GET')
    return res.status(200).json(jira)
  res.status(200).json({ name: 'John Doe' })
}

/**
 * go to https://zendesk.atlassian.net/rest/api/3/search?jql=assignee%20in%20(currentuser())
 *
 * create a new file jira.json and paste json there
 */
