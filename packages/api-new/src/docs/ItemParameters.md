
# ItemParameters


## Properties

Name | Type
------------ | -------------
`logit` | number
`bistaPoints` | number
`solutionFrequencyGymnasium` | number
`solutionFrequencyNonGymnasium` | number
`competenceLevel` | object
`coreIdea` | object
`cognitiveDemandLevel` | object
`generalMathematicalCompetence` | Array&lt;object&gt;
`domain` | Array&lt;object&gt;
`competences` | Array&lt;object&gt;

## Example

```typescript
import type { ItemParameters } from ''

// TODO: Update the object below with actual values
const example = {
  "logit": null,
  "bistaPoints": null,
  "solutionFrequencyGymnasium": null,
  "solutionFrequencyNonGymnasium": null,
  "competenceLevel": null,
  "coreIdea": null,
  "cognitiveDemandLevel": null,
  "generalMathematicalCompetence": null,
  "domain": null,
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


