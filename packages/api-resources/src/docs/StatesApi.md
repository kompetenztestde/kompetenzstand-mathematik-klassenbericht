# StatesApi

All URIs are relative to *https://apps.indibit.eu/tba3-api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getStateAggregations**](StatesApi.md#getstateaggregations) | **GET** /states/{id}/aggregations | Aggregierte Werte (z.B. Lösungshäufigkeiten) im Bundesland |
| [**getStateCompetenceLevels**](StatesApi.md#getstatecompetencelevels) | **GET** /states/{id}/competence-levels | Kompetenzstufenverteilung im Bundesland |
| [**getStateItems**](StatesApi.md#getstateitems) | **GET** /states/{id}/items | Lösungshäufigkeiten je Item im Bundesland |



## getStateAggregations

> Array&lt;AggregationsInner&gt; getStateAggregations(id, type, aggregation, comparison)

Aggregierte Werte (z.B. Lösungshäufigkeiten) im Bundesland

### Example

```ts
import {
  Configuration,
  StatesApi,
} from '';
import type { GetStateAggregationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new StatesApi();

  const body = {
    // string | Id des Bundeslandes
    id: beispielland,
    // string | Wertegruppen, welche ausgegeben werden sollen (optional)
    type: ,
    // string | Aggregationsarten, die berechnet werden sollen (optional)
    aggregation: aggregation_example,
    // string | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen (optional)
    comparison: comparison_example,
  } satisfies GetStateAggregationsRequest;

  try {
    const data = await api.getStateAggregations(body);
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
| **id** | `string` | Id des Bundeslandes | [Defaults to `undefined`] |
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
| **200** | Abhängig vom Typ berechnete Aggregation für das Bundesland |  -  |
| **400** | Ungültige Anfrage, z.B. ungültige Werte für die Parameter |  -  |
| **404** | Bundesland oder Werte für das Bundesland nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getStateCompetenceLevels

> Array&lt;CompetenceLevelsInner&gt; getStateCompetenceLevels(id, comparison)

Kompetenzstufenverteilung im Bundesland

### Example

```ts
import {
  Configuration,
  StatesApi,
} from '';
import type { GetStateCompetenceLevelsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new StatesApi();

  const body = {
    // string | Id des Bundeslandes
    id: beispielland,
    // string | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen (optional)
    comparison: comparison_example,
  } satisfies GetStateCompetenceLevelsRequest;

  try {
    const data = await api.getStateCompetenceLevels(body);
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
| **id** | `string` | Id des Bundeslandes | [Defaults to `undefined`] |
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
| **200** | Kompetenzstufenverteilung im Bundesland |  -  |
| **400** | Ungültige Anfrage, z.B. ungültige Werte für die Parameter |  -  |
| **404** | Bundesland oder Kompetensstufenverteilung für das Bundesland nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getStateItems

> Array&lt;ItemsInner&gt; getStateItems(id, comparison)

Lösungshäufigkeiten je Item im Bundesland

### Example

```ts
import {
  Configuration,
  StatesApi,
} from '';
import type { GetStateItemsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new StatesApi();

  const body = {
    // string | Id des Bundeslandes
    id: beispielland,
    // string | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen (optional)
    comparison: comparison_example,
  } satisfies GetStateItemsRequest;

  try {
    const data = await api.getStateItems(body);
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
| **id** | `string` | Id des Bundeslandes | [Defaults to `undefined`] |
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
| **200** | Lösungshäufigkeiten je Item im Bundesland |  -  |
| **400** | Ungültige Anfrage, z.B. ungültige Werte für die Parameter |  -  |
| **404** | Bundesland oder Lösungshäufigkeit je Item für das Bundesland nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

