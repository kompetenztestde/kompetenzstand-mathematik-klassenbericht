
# ItemsStudentsDataInner


## Properties

Name | Type
------------ | -------------
`code` | string
`properties` | [Array&lt;ItemsStudentsDataInnerPropertiesInner&gt;](ItemsStudentsDataInnerPropertiesInner.md)
`covariates` | Array&lt;object&gt;
`items` | [Array&lt;ItemStudentInner&gt;](ItemStudentInner.md)

## Example

```typescript
import type { ItemsStudentsDataInner } from ''

// TODO: Update the object below with actual values
const example = {
  "code": null,
  "properties": null,
  "covariates": null,
  "items": null,
} satisfies ItemsStudentsDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ItemsStudentsDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


