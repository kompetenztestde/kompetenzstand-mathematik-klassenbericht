
# ItemParameters

(importierte) Itemparameter aus den Itemkennwerten des IQB. Bisher unvollständige, exemplarische Liste.

## Properties

Name | Type
------------ | -------------
`logit` | number
`bistaPoints` | number
`solutionFrequencyGymnasium` | number
`solutionFrequencyNonGymnasium` | number
`solutionFrequencyPrimarySchool` | number
`subject` | string
`domain` | string
`competenceLevel` | [CompetenceLevel](CompetenceLevel.md)
`competences` | [Array&lt;Competence&gt;](Competence.md)

## Example

```typescript
import type { ItemParameters } from ''

// TODO: Update the object below with actual values
const example = {
  "logit": null,
  "bistaPoints": null,
  "solutionFrequencyGymnasium": null,
  "solutionFrequencyNonGymnasium": null,
  "solutionFrequencyPrimarySchool": null,
  "subject": null,
  "domain": null,
  "competenceLevel": null,
  "competences": null,
} satisfies ItemParameters

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ItemParameters
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


