exports.handler = function(event, context)
{
  console.log("MonitorEC2()");
  console.log("Here's the event:\n:"+JSON.stringify(event, null, 4));
  context.succeed("Ready!");
};