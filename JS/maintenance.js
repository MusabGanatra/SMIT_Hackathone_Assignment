// Load All Issues

async function loadIssues(){

const { data, error } =
await supabaseClient
.from("issues")
.select("*")
.order("created_at", { ascending:false });

if(error){
console.log(error);
return;
}

let rows = "";

data.forEach(issue => {

rows += `
<tr>

<td>${issue.title}</td>

<td>${issue.priority}</td>

<td>${issue.status}</td>

<td>

${
issue.status === "Resolved"
?
"Resolved"
:
`<button class="btn"
onclick="resolveIssue(
'${issue.id}',
'${issue.asset_id}',
'${issue.title}'
)">
Resolve
</button>`
}

</td>

</tr>
`;

});

document.getElementById("maintenanceTable").innerHTML =
rows;

}



// Resolve Issue

async function resolveIssue(
issueId,
assetId,
issueTitle
){

// Update Issue Status

const { error: issueError } =
await supabaseClient
.from("issues")
.update({
status:"Resolved"
})
.eq("id", issueId);

if(issueError){
alert(issueError.message);
return;
}



// Update Asset Status

const { error: assetError } =
await supabaseClient
.from("assets")
.update({
status:"Operational"
})
.eq("id", assetId);

if(assetError){
alert(assetError.message);
return;
}



// Save Maintenance Record

await supabaseClient
.from("maintenance")
.insert([
{
issue_id: issueId,
technician_name: "Technician",
notes: "Issue Fixed Successfully",
parts_used: "N/A",
cost: 0
}
]);



// Save History Record

await supabaseClient
.from("history")
.insert([
{
asset_id: assetId,
action: "Resolved Issue: " + issueTitle,
actor: "Technician"
}
]);



alert("Issue Resolved Successfully");

loadIssues();

}



// Initial Load

loadIssues();