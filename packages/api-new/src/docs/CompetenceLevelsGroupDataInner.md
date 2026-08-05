
# CompetenceLevelsGroupDataInner


## Properties

Name | Type
------------ | -------------
`name` | string
`domain` | [CompetenceLevelsGroupDataInnerDomain](CompetenceLevelsGroupDataInnerDomain.md)
`subject` | [CompetenceLevelsGroupDataInnerSubject](CompetenceLevelsGroupDataInnerSubject.md)
`competenceLevels` | [Array&lt;CompetenceLevelsGroupDataInnerCompetenceLevelsInner&gt;](CompetenceLevelsGroupDataInnerCompetenceLevelsInner.md)

## Example

```typescript
import type { CompetenceLevelsGroupDataInner } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "domain": null,
  "subject": null,
  "competenceLevels": null,
} satisfies CompetenceLevelsGroupDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CompetenceLevelsGroupDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


