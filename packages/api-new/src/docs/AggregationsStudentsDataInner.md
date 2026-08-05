
# AggregationsStudentsDataInner


## Properties

Name | Type
------------ | -------------
`code` | string
`properties` | [Array&lt;AggregationsStudentsDataInnerPropertiesInner&gt;](AggregationsStudentsDataInnerPropertiesInner.md)
`covariates` | Array&lt;object&gt;
`competenceLevels` | Array&lt;object&gt;
`aggregations` | [Array&lt;AggregationItemsInner&gt;](AggregationItemsInner.md)

## Example

```typescript
import type { AggregationsStudentsDataInner } from ''

// TODO: Update the object below with actual values
const example = {
  "code": null,
  "properties": null,
  "covariates": null,
  "competenceLevels": null,
  "aggregations": null,
} satisfies AggregationsStudentsDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AggregationsStudentsDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


