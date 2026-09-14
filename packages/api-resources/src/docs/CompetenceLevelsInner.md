
# CompetenceLevelsInner


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`domain` | [Domain](Domain.md)
`subject` | [Subject](Subject.md)
`covariates` | [Array&lt;Characteristic&gt;](Characteristic.md)
`properties` | [Array&lt;ValueGroupPropertiesInner&gt;](ValueGroupPropertiesInner.md)
`competenceLevels` | [Array&lt;CompetenceLevelStatisticsInner&gt;](CompetenceLevelStatisticsInner.md)

## Example

```typescript
import type { CompetenceLevelsInner } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "domain": null,
  "subject": null,
  "covariates": null,
  "properties": null,
  "competenceLevels": null,
} satisfies CompetenceLevelsInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CompetenceLevelsInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


