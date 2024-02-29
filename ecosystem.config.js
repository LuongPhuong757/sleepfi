module.exports = {
  apps: [
    {
      name: "api",
      script: "yarn start:prod",
      watch: true
    },
    {
      name: "handle-crawl",
      script: "yarn crawl",
      watch: true
    },
    {
      name: "handle-withdraw",
      script: "yarn handle-withdraw",
      watch: true
    }]
}
