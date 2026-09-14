# SchoolsApi

All URIs are relative to *https://apps.indibit.eu/tba3-api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getSchoolAggregations**](SchoolsApi.md#getschoolaggregations) | **GET** /schools/{id}/aggregations | Aggregierte Werte (z.B. Lösungshäufigkeiten) an der Schule |
| [**getSchoolCompetenceLevels**](SchoolsApi.md#getschoolcompetencelevels) | **GET** /schools/{id}/competence-levels | Kompetenzstufenverteilung an der Schule |
| [**getSchoolItems**](SchoolsApi.md#getschoolitems) | **GET** /schools/{id}/items | Lösungshäufigkeiten je Item an der Schule |



## getSchoolAggregations

> Array&lt;AggregationsInner&gt; getSchoolAggregations(id, type, aggregation, comparison)

Aggregierte Werte (z.B. Lösungshäufigkeiten) an der Schule

### Example

```ts
import {
  Configuration,
  SchoolsApi,
} from '';
import type { GetSchoolAggregationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SchoolsApi();

  const body = {
    // string | Id der Schule
    id: gs-musterstadt,
    // string | Wertegruppen, welche ausgegeben werden sollen (optional)
    type: ,
    // string | Aggregationsarten, die berechnet werden sollen (optional)
    aggregation: aggregation_example,
    // string | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen (optional)
    comparison: comparison_example,
  } satisfies GetSchoolAggregationsRequest;

  try {
    const data = await api.getSchoolAggregations(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | Id der Schule | [Defaults to `undefined`] |
| **type** | `string` | Wertegruppen, welche ausgegeben werden sollen | [Optional] [Defaults to `undefined`] |
| **aggregation** | `string` | Aggregationsarten, die berechnet werden sollen | [Optional] [Defaults to `undefined`] |
| **comparison** | `string` | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;AggregationsInner&gt;**](AggregationsInner.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Abhängig vom Typ berechnete Aggregation für die Schule |  -  |
| **400** | Ungültige Anfrage, z.B. ungültige Werte für die Parameter |  -  |
| **404** | Schule oder Werte für die Schule nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSchoolCompetenceLevels

> Array&lt;CompetenceLevelsInner&gt; getSchoolCompetenceLevels(id, comparison)

Kompetenzstufenverteilung an der Schule

### Example

```ts
import {
  Configuration,
  SchoolsApi,
} from '';
import type { GetSchoolCompetenceLevelsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SchoolsApi();

  const body = {
    // string | Id der Schule
    id: gs-musterstadt,
    // string | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen (optional)
    comparison: comparison_example,
  } satisfies GetSchoolCompetenceLevelsRequest;

  try {
    const data = await api.getSchoolCompetenceLevels(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | Id der Schule | [Defaults to `undefined`] |
| **comparison** | `string` | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;CompetenceLevelsInner&gt;**](CompetenceLevelsInner.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Kompetenzstufenverteilung an der Schule |  -  |
| **400** | Ungültige Anfrage, z.B. ungültige Werte für die Parameter |  -  |
| **404** | Schule oder Kompetensstufenverteilung für die Schule nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSchoolItems

> Array&lt;ItemsInner&gt; getSchoolItems(id, comparison)

Lösungshäufigkeiten je Item an der Schule

### Example

```ts
import {
  Configuration,
  SchoolsApi,
} from '';
import type { GetSchoolItemsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SchoolsApi();

  const body = {
    // string | Id der Schule
    id: gs-musterstadt,
    // string | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen (optional)
    comparison: comparison_example,
  } satisfies GetSchoolItemsRequest;

  try {
    const data = await api.getSchoolItems(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | Id der Schule | [Defaults to `undefined`] |
| **comparison** | `string` | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;ItemsInner&gt;**](ItemsInner.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Lösungshäufigkeiten je Item an der Schule |  -  |
| **400** | Ungültige Anfrage, z.B. ungültige Werte für die Parameter |  -  |
| **404** | Schule oder Lösungshäufigkeit je Item für die Schule nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

