
# ParticipatedGroupsInner


## Properties

Name | Type
------------ | -------------
`groupId` | number
`groupLevel` | string
`groupName` | string
`numberOfStudents` | number
`schoolForm` | string
`participatedTests` | Array&lt;number&gt;

## Example

```typescript
import type { ParticipatedGroupsInner } from ''

// TODO: Update the object below with actual values
const example = {
  "groupId": null,
  "groupLevel": null,
  "groupName": null,
  "numberOfStudents": null,
  "schoolForm": null,
  "participatedTests": null,
} satisfies ParticipatedGroupsInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ParticipatedGroupsInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


