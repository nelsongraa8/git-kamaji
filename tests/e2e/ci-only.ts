export const runsInGithubActionsWindows =
  process.env.GITHUB_ACTIONS === "true" && process.platform === "win32";