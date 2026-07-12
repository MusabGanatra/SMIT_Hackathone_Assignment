// Get Asset ID From URL

const params =
new URLSearchParams(window.location.search);

const assetId =
params.get("id");


// Submit Issue

async function submitIssue(){

const title =
document.getElementById("title").value;

const description =
document.getElementById("description").value;

const priority =
document.getElementById("priority").value;


if(title === ""){

alert("Please Enter Issue Title");

return;

}


const issueNumber =
"ISS-" + Date.now();


// Save Issue

const { error } =
await supabaseClient
.from("issues")
.insert([
{
asset_id: assetId,
issue_number: issueNumber,
title: title,
description: description,
priority: priority,
status: "Reported"
}
]);


if(error){

alert(error.message);

return;

}


// Update Asset Status

await supabaseClient
.from("assets")
.update({
status: "Issue Reported"
})
.eq("id", assetId);


// Add History Record

await supabaseClient
.from("history")
.insert([
{
asset_id: assetId,
action: "Issue Reported: " + title,
actor: "User"
}
]);


alert("Issue Submitted Successfully");


window.location.href =
"maintenance.html";

}