# ReportDataTba3Api

All URIs are relative to *https://api.inio.de/report_data_tba3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**schoolInformationGet**](ReportDataTba3Api.md#schoolinformationget) | **GET** /school-information | Einige Stammdaten der Schule wie Name und Schulnummer |
| [**testGroupsGet**](ReportDataTba3Api.md#testgroupsget) | **GET** /test-groups | Auflistung aller Testgruppen |
| [**testGroupsTgIdParticipatedGroupsGet**](ReportDataTba3Api.md#testgroupstgidparticipatedgroupsget) | **GET** /test-groups/{tg-id}/participated-groups | Teilgenommene Klassen |
| [**testGroupsTgIdTestsGet**](ReportDataTba3Api.md#testgroupstgidtestsget) | **GET** /test-groups/{tg-id}/tests | Alle Tests |
| [**testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet**](ReportDataTba3Api.md#testgroupstgidteststestidgroupsgroupidaggregationsget) | **GET** /test-groups/{tg-id}/tests/{test-id}/groups/{group-id}/aggregations | Aggregierte Werte (z.B. Lösungshäufigkeiten) in der Lerngruppe |
| [**testGroupsTgIdTestsTestIdGroupsGroupIdCompetenceLevelsGet**](ReportDataTba3Api.md#testgroupstgidteststestidgroupsgroupidcompetencelevelsget) | **GET** /test-groups/{tg-id}/tests/{test-id}/groups/{group-id}/competence-levels | Kompetenzstufen-Verteilung der Lerngruppe und/oder je Schüler |
| [**testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet**](ReportDataTba3Api.md#testgroupstgidteststestidgroupsgroupiditemsget) | **GET** /test-groups/{tg-id}/tests/{test-id}/groups/{group-id}/items | Lösungshäufigkeiten je Item in der Lerngruppe |



## schoolInformationGet

> SchoolInformationGet200Response schoolInformationGet(schoolId)

Einige Stammdaten der Schule wie Name und Schulnummer

### Example

```ts
import {
  Configuration,
  ReportDataTba3Api,
} from '';
import type { SchoolInformationGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: X-API-KEY-SCHOOL
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY-USER
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReportDataTba3Api(config);

  const body = {
    // number | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. (optional)
    schoolId: 56,
  } satisfies SchoolInformationGetRequest;

  try {
    const data = await api.schoolInformationGet(body);
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
| **schoolId** | `number` | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. | [Optional] [Defaults to `undefined`] |

### Return type

[**SchoolInformationGet200Response**](SchoolInformationGet200Response.md)

### Authorization

[X-API-KEY-SCHOOL](../README.md#X-API-KEY-SCHOOL), [X-API-KEY-USER](../README.md#X-API-KEY-USER), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ok |  -  |
| **400** | Ungültige Anfrage (z.B. fehlende school-id bei X-API-KEY-USER) |  -  |
| **401** | Authentifizierung fehlgeschlagen |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## testGroupsGet

> TestGroupsGet200Response testGroupsGet()

Auflistung aller Testgruppen

Die ID von einer Testgruppe (tg-id) wird für alle weiteren API-Aufrufe benötigt

### Example

```ts
import {
  Configuration,
  ReportDataTba3Api,
} from '';
import type { TestGroupsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: X-API-KEY-SCHOOL
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY-USER
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReportDataTba3Api(config);

  try {
    const data = await api.testGroupsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**TestGroupsGet200Response**](TestGroupsGet200Response.md)

### Authorization

[X-API-KEY-SCHOOL](../README.md#X-API-KEY-SCHOOL), [X-API-KEY-USER](../README.md#X-API-KEY-USER), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ok |  -  |
| **401** | Authentifizierung fehlgeschlagen |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## testGroupsTgIdParticipatedGroupsGet

> TestGroupsTgIdParticipatedGroupsGet200Response testGroupsTgIdParticipatedGroupsGet(tgId, schoolId, testIds)

Teilgenommene Klassen

### Example

```ts
import {
  Configuration,
  ReportDataTba3Api,
} from '';
import type { TestGroupsTgIdParticipatedGroupsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: X-API-KEY-SCHOOL
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY-USER
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReportDataTba3Api(config);

  const body = {
    // number
    tgId: 270,
    // number | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. (optional)
    schoolId: 56,
    // string | Filter: Test-ID (kommagetrennt mgl) (optional)
    testIds: testIds_example,
  } satisfies TestGroupsTgIdParticipatedGroupsGetRequest;

  try {
    const data = await api.testGroupsTgIdParticipatedGroupsGet(body);
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
| **tgId** | `number` |  | [Defaults to `undefined`] |
| **schoolId** | `number` | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. | [Optional] [Defaults to `undefined`] |
| **testIds** | `string` | Filter: Test-ID (kommagetrennt mgl) | [Optional] [Defaults to `undefined`] |

### Return type

[**TestGroupsTgIdParticipatedGroupsGet200Response**](TestGroupsTgIdParticipatedGroupsGet200Response.md)

### Authorization

[X-API-KEY-SCHOOL](../README.md#X-API-KEY-SCHOOL), [X-API-KEY-USER](../README.md#X-API-KEY-USER), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ok |  -  |
| **400** | Testgruppe wird von dieser API nicht unterstützt (nur tg-id 270 erlaubt) |  -  |
| **401** | Authentifizierung fehlgeschlagen |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## testGroupsTgIdTestsGet

> TestGroupsTgIdTestsGet200Response testGroupsTgIdTestsGet(tgId, schoolId, testIds)

Alle Tests

### Example

```ts
import {
  Configuration,
  ReportDataTba3Api,
} from '';
import type { TestGroupsTgIdTestsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: X-API-KEY-SCHOOL
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY-USER
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReportDataTba3Api(config);

  const body = {
    // number
    tgId: 270,
    // number | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. (optional)
    schoolId: 56,
    // string | Filter: Test-ID (kommagetrennt mgl). Sonderfall: \'dk3\' für den zusammenfassenden Südtirol-DK3-Test. (optional)
    testIds: testIds_example,
  } satisfies TestGroupsTgIdTestsGetRequest;

  try {
    const data = await api.testGroupsTgIdTestsGet(body);
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
| **tgId** | `number` |  | [Defaults to `undefined`] |
| **schoolId** | `number` | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. | [Optional] [Defaults to `undefined`] |
| **testIds** | `string` | Filter: Test-ID (kommagetrennt mgl). Sonderfall: \&#39;dk3\&#39; für den zusammenfassenden Südtirol-DK3-Test. | [Optional] [Defaults to `undefined`] |

### Return type

[**TestGroupsTgIdTestsGet200Response**](TestGroupsTgIdTestsGet200Response.md)

### Authorization

[X-API-KEY-SCHOOL](../README.md#X-API-KEY-SCHOOL), [X-API-KEY-USER](../README.md#X-API-KEY-USER), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ok |  -  |
| **400** | Testgruppe wird von dieser API nicht unterstützt (nur tg-id 270 erlaubt) |  -  |
| **401** | Authentifizierung fehlgeschlagen |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet

> TestGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet200Response testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet(tgId, testId, groupId, schoolId, aggregation, type, studentCode)

Aggregierte Werte (z.B. Lösungshäufigkeiten) in der Lerngruppe

### Example

```ts
import {
  Configuration,
  ReportDataTba3Api,
} from '';
import type { TestGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: X-API-KEY-SCHOOL
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY-USER
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReportDataTba3Api(config);

  const body = {
    // number
    tgId: 270,
    // number
    testId: 9516,
    // number
    groupId: 1001,
    // number | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. (optional)
    schoolId: 56,
    // string | Kommagetrennte Liste von Aggregationstypen. Mögliche Werte: total, domain, competenceLevelOrthography, competenceLevelReading, cognitiveDemandLevel, competenceId, coreIdea, generalMathematicalCompetence, competenceLevel. Ohne Angabe werden alle zurückgeliefert. (optional)
    aggregation: aggregation_example,
    // 'group' | 'students' | 'group,students' | Bestimmt, welche Daten zurückgeliefert werden: nur Gruppendaten (group), nur Schülerdaten (students) oder beides (group,students). Standard: group. (optional)
    type: type_example,
    // string | Filtert Schülerdaten auf einen einzelnen Schüler anhand des Schülercodes. Impliziert type=students. (optional)
    studentCode: studentCode_example,
  } satisfies TestGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGetRequest;

  try {
    const data = await api.testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet(body);
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
| **tgId** | `number` |  | [Defaults to `undefined`] |
| **testId** | `number` |  | [Defaults to `undefined`] |
| **groupId** | `number` |  | [Defaults to `undefined`] |
| **schoolId** | `number` | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. | [Optional] [Defaults to `undefined`] |
| **aggregation** | `string` | Kommagetrennte Liste von Aggregationstypen. Mögliche Werte: total, domain, competenceLevelOrthography, competenceLevelReading, cognitiveDemandLevel, competenceId, coreIdea, generalMathematicalCompetence, competenceLevel. Ohne Angabe werden alle zurückgeliefert. | [Optional] [Defaults to `undefined`] |
| **type** | `group`, `students`, `group,students` | Bestimmt, welche Daten zurückgeliefert werden: nur Gruppendaten (group), nur Schülerdaten (students) oder beides (group,students). Standard: group. | [Optional] [Defaults to `undefined`] [Enum: group, students, group,students] |
| **studentCode** | `string` | Filtert Schülerdaten auf einen einzelnen Schüler anhand des Schülercodes. Impliziert type&#x3D;students. | [Optional] [Defaults to `undefined`] |

### Return type

[**TestGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet200Response**](TestGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet200Response.md)

### Authorization

[X-API-KEY-SCHOOL](../README.md#X-API-KEY-SCHOOL), [X-API-KEY-USER](../README.md#X-API-KEY-USER), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ok |  -  |
| **400** | Test-ID wird von dieser API nicht unterstützt (nur 9516, 9522, 9524 erlaubt) |  -  |
| **401** | Authentifizierung fehlgeschlagen |  -  |
| **404** | Gruppe oder Test nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## testGroupsTgIdTestsTestIdGroupsGroupIdCompetenceLevelsGet

> TestGroupsTgIdTestsTestIdGroupsGroupIdCompetenceLevelsGet200Response testGroupsTgIdTestsTestIdGroupsGroupIdCompetenceLevelsGet(tgId, testId, groupId, schoolId, studentCode, type)

Kompetenzstufen-Verteilung der Lerngruppe und/oder je Schüler

Gibt Kompetenzstufen-Verteilung der Lerngruppe (groupData) und/oder Kompetenzstufen je Schüler (studentsData) zurück. Wenn ein student-code angegeben wird, wird groupData nicht zurückgegeben – auch wenn type&#x3D;group oder group,students gesetzt ist. In diesem Fall enthält message einen entsprechenden Hinweis.

### Example

```ts
import {
  Configuration,
  ReportDataTba3Api,
} from '';
import type { TestGroupsTgIdTestsTestIdGroupsGroupIdCompetenceLevelsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: X-API-KEY-SCHOOL
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY-USER
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReportDataTba3Api(config);

  const body = {
    // number
    tgId: 270,
    // number
    testId: 9516,
    // number
    groupId: 1001,
    // number | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. (optional)
    schoolId: 56,
    // string | Filtert Schülerdaten auf einen einzelnen Schüler anhand des Schülercodes. (optional)
    studentCode: studentCode_example,
    // 'group' | 'students' | 'group,students' | Bestimmt, welche Daten zurückgeliefert werden: Gruppenverteilung (group), Schülerdaten (students) oder beides (group,students). Standard: group. (optional)
    type: type_example,
  } satisfies TestGroupsTgIdTestsTestIdGroupsGroupIdCompetenceLevelsGetRequest;

  try {
    const data = await api.testGroupsTgIdTestsTestIdGroupsGroupIdCompetenceLevelsGet(body);
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
| **tgId** | `number` |  | [Defaults to `undefined`] |
| **testId** | `number` |  | [Defaults to `undefined`] |
| **groupId** | `number` |  | [Defaults to `undefined`] |
| **schoolId** | `number` | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. | [Optional] [Defaults to `undefined`] |
| **studentCode** | `string` | Filtert Schülerdaten auf einen einzelnen Schüler anhand des Schülercodes. | [Optional] [Defaults to `undefined`] |
| **type** | `group`, `students`, `group,students` | Bestimmt, welche Daten zurückgeliefert werden: Gruppenverteilung (group), Schülerdaten (students) oder beides (group,students). Standard: group. | [Optional] [Defaults to `&#39;group&#39;`] [Enum: group, students, group,students] |

### Return type

[**TestGroupsTgIdTestsTestIdGroupsGroupIdCompetenceLevelsGet200Response**](TestGroupsTgIdTestsTestIdGroupsGroupIdCompetenceLevelsGet200Response.md)

### Authorization

[X-API-KEY-SCHOOL](../README.md#X-API-KEY-SCHOOL), [X-API-KEY-USER](../README.md#X-API-KEY-USER), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ok |  -  |
| **400** | Test-ID wird von dieser API nicht unterstützt (nur 9516, 9522, 9524 erlaubt) |  -  |
| **401** | Authentifizierung fehlgeschlagen |  -  |
| **404** | Gruppe oder Test nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet

> TestGroupsTgIdTestsTestIdGroupsGroupIdItemsGet200Response testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet(tgId, testId, groupId, schoolId, type, studentCode)

Lösungshäufigkeiten je Item in der Lerngruppe

### Example

```ts
import {
  Configuration,
  ReportDataTba3Api,
} from '';
import type { TestGroupsTgIdTestsTestIdGroupsGroupIdItemsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: X-API-KEY-SCHOOL
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY-USER
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReportDataTba3Api(config);

  const body = {
    // number
    tgId: 270,
    // number
    testId: 9516,
    // number
    groupId: 1001,
    // number | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. (optional)
    schoolId: 56,
    // 'group' | 'students' | 'group,students' | Bestimmt, welche Daten zurückgeliefert werden: nur Gruppendaten (group), nur Schülerdaten (students) oder beides (group,students). Standard: group. (optional)
    type: type_example,
    // string | Filtert Schülerdaten auf einen einzelnen Schüler anhand des Schülercodes. Impliziert type=students. (optional)
    studentCode: studentCode_example,
  } satisfies TestGroupsTgIdTestsTestIdGroupsGroupIdItemsGetRequest;

  try {
    const data = await api.testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet(body);
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
| **tgId** | `number` |  | [Defaults to `undefined`] |
| **testId** | `number` |  | [Defaults to `undefined`] |
| **groupId** | `number` |  | [Defaults to `undefined`] |
| **schoolId** | `number` | Schul-ID notwendig, falls mit X-API-KEY-USER authentifiziert wurde. Bei X-API-KEY-SCHOOL oder Bearer Token wird die Schule automatisch erkannt. | [Optional] [Defaults to `undefined`] |
| **type** | `group`, `students`, `group,students` | Bestimmt, welche Daten zurückgeliefert werden: nur Gruppendaten (group), nur Schülerdaten (students) oder beides (group,students). Standard: group. | [Optional] [Defaults to `undefined`] [Enum: group, students, group,students] |
| **studentCode** | `string` | Filtert Schülerdaten auf einen einzelnen Schüler anhand des Schülercodes. Impliziert type&#x3D;students. | [Optional] [Defaults to `undefined`] |

### Return type

[**TestGroupsTgIdTestsTestIdGroupsGroupIdItemsGet200Response**](TestGroupsTgIdTestsTestIdGroupsGroupIdItemsGet200Response.md)

### Authorization

[X-API-KEY-SCHOOL](../README.md#X-API-KEY-SCHOOL), [X-API-KEY-USER](../README.md#X-API-KEY-USER), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ok |  -  |
| **400** | Test-ID wird von dieser API nicht unterstützt (nur 9516, 9522, 9524 erlaubt) |  -  |
| **401** | Authentifizierung fehlgeschlagen |  -  |
| **404** | Gruppe oder Test nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

