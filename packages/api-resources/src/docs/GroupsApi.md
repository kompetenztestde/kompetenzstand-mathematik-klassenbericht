# GroupsApi

All URIs are relative to *https://apps.indibit.eu/tba3-api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getGroupAggregations**](GroupsApi.md#getgroupaggregations) | **GET** /groups/{id}/aggregations | Aggregierte Werte (z.B. Lösungshäufigkeiten) in der Lerngruppe |
| [**getGroupCompetenceLevels**](GroupsApi.md#getgroupcompetencelevels) | **GET** /groups/{id}/competence-levels | Kompetenzstufenverteilung in der Lerngruppe |
| [**getGroupItems**](GroupsApi.md#getgroupitems) | **GET** /groups/{id}/items | Lösungshäufigkeiten je Item in der Lerngruppe |



## getGroupAggregations

> Array&lt;AggregationsInner&gt; getGroupAggregations(id, type, aggregation, comparison)

Aggregierte Werte (z.B. Lösungshäufigkeiten) in der Lerngruppe

### Example

```ts
import {
  Configuration,
  GroupsApi,
} from '';
import type { GetGroupAggregationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GroupsApi();

  const body = {
    // string | Id der Lerngruppe
    id: 3a-deutsch,
    // string | Wertegruppen, welche ausgegeben werden sollen (optional)
    type: ,
    // string | Aggregationsarten, die berechnet werden sollen (optional)
    aggregation: aggregation_example,
    // string | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen (optional)
    comparison: comparison_example,
  } satisfies GetGroupAggregationsRequest;

  try {
    const data = await api.getGroupAggregations(body);
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
| **id** | `string` | Id der Lerngruppe | [Defaults to `undefined`] |
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
| **200** | Abhängig vom Typ berechnete Aggregation für die Lerngruppe |  -  |
| **400** | Ungültige Anfrage, z.B. ungültige Werte für die Parameter |  -  |
| **404** | Lerngruppe oder Werte für die Lerngruppe nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getGroupCompetenceLevels

> Array&lt;CompetenceLevelsInner&gt; getGroupCompetenceLevels(id, type, comparison)

Kompetenzstufenverteilung in der Lerngruppe

### Example

```ts
import {
  Configuration,
  GroupsApi,
} from '';
import type { GetGroupCompetenceLevelsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GroupsApi();

  const body = {
    // string | Id der Lerngruppe
    id: 3a-deutsch,
    // string | Wertegruppen, welche ausgegeben werden sollen (optional)
    type: ,
    // string | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen (optional)
    comparison: comparison_example,
  } satisfies GetGroupCompetenceLevelsRequest;

  try {
    const data = await api.getGroupCompetenceLevels(body);
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
| **id** | `string` | Id der Lerngruppe | [Defaults to `undefined`] |
| **type** | `string` | Wertegruppen, welche ausgegeben werden sollen | [Optional] [Defaults to `undefined`] |
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
| **200** | Kompetenzstufenverteilung in der Lerngruppe |  -  |
| **400** | Ungültige Anfrage, z.B. ungültige Werte für die Parameter |  -  |
| **404** | Lerngruppe oder Kompetenzstufenverteilung für die Lerngruppe nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getGroupItems

> Array&lt;ItemsInner&gt; getGroupItems(id, type, comparison)

Lösungshäufigkeiten je Item in der Lerngruppe

### Example

```ts
import {
  Configuration,
  GroupsApi,
} from '';
import type { GetGroupItemsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GroupsApi();

  const body = {
    // string | Id der Lerngruppe
    id: 3a-deutsch,
    // string | Wertegruppen, welche ausgegeben werden sollen (optional)
    type: ,
    // string | Filter für bestimmte Vergleichsgruppen, die ausgegeben werden sollen (optional)
    comparison: comparison_example,
  } satisfies GetGroupItemsRequest;

  try {
    const data = await api.getGroupItems(body);
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
| **id** | `string` | Id der Lerngruppe | [Defaults to `undefined`] |
| **type** | `string` | Wertegruppen, welche ausgegeben werden sollen | [Optional] [Defaults to `undefined`] |
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
| **200** | Lösungshäufigkeiten je Item in der Lerngruppe |  -  |
| **400** | Ungültige Anfrage, z.B. ungültige Werte für die Parameter |  -  |
| **404** | Lerngruppe oder Lösungshäufigkeiten für die Lerngruppe nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

