# AuthApi

All URIs are relative to *https://api.inio.de/auth*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**checkGet**](AuthApi.md#checkget) | **GET** /check | Authentifizierungsstatus abrufen |
| [**generateJwtGet**](AuthApi.md#generatejwtget) | **GET** /generate-jwt | JWT fuer Schule erzeugen |
| [**schoolPost**](AuthApi.md#schoolpost) | **POST** /school | Schule anmelden |
| [**studentPost**](AuthApi.md#studentpost) | **POST** /student | Schüler*in anmelden |



## checkGet

> CheckGet200Response checkGet()

Authentifizierungsstatus abrufen

Prueft die uebergebenen Zugangsdaten und liefert die authentifizierten User- oder Schulinformationen zurueck.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { CheckGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: X-API-KEY-SCHOOL
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY-USER
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthApi(config);

  try {
    const data = await api.checkGet();
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

[**CheckGet200Response**](CheckGet200Response.md)

### Authorization

[X-API-KEY-SCHOOL](../README.md#X-API-KEY-SCHOOL), [X-API-KEY](../README.md#X-API-KEY), [X-API-KEY-USER](../README.md#X-API-KEY-USER), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Authentifizierung erfolgreich |  -  |
| **401** | Authentifizierung fehlgeschlagen |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## generateJwtGet

> GenerateJwtDataResponse generateJwtGet(schoolId, service, expiresDays)

JWT fuer Schule erzeugen

Erzeugt ein Bearer-JWT fuer eine Schule anhand von schoolId, service und expiresDays. Dieser Endpunkt ist nur fuer authentifizierte KT-User vorgesehen.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { GenerateJwtGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: X-API-KEY-USER
    apiKey: "YOUR API KEY",
  });
  const api = new AuthApi(config);

  const body = {
    // number | ID der Schule
    schoolId: 56,
    // 'all' | 'report_data' | Service/Audience, die im JWT als aud gesetzt wird
    service: service_example,
    // number | Gueltigkeit des Tokens in Tagen
    expiresDays: 56,
  } satisfies GenerateJwtGetRequest;

  try {
    const data = await api.generateJwtGet(body);
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
| **schoolId** | `number` | ID der Schule | [Defaults to `undefined`] |
| **service** | `all`, `report_data` | Service/Audience, die im JWT als aud gesetzt wird | [Defaults to `undefined`] [Enum: all, report_data] |
| **expiresDays** | `number` | Gueltigkeit des Tokens in Tagen | [Defaults to `undefined`] |

### Return type

[**GenerateJwtDataResponse**](GenerateJwtDataResponse.md)

### Authorization

[X-API-KEY-USER](../README.md#X-API-KEY-USER)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | JWT erfolgreich erzeugt |  -  |
| **400** | Fehlende oder ungueltige Parameter |  -  |
| **401** | Nicht autorisiert (KT-User erforderlich) |  -  |
| **404** | Schule nicht gefunden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## schoolPost

> JwtTokenSchoolResponse schoolPost(schoolLoginRequest)

Schule anmelden

Authentifiziert eine Schule ueber bundesland, schulname und passwort. Bei gueltigen Zugangsdaten wird ein Bearer-JWT zurueckgegeben.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { SchoolPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: X-API-KEY-SCHOOL
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY-USER
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthApi(config);

  const body = {
    // SchoolLoginRequest
    schoolLoginRequest: {"region":"TH","schulNr":"Musterschule","passwort":"secret"},
  } satisfies SchoolPostRequest;

  try {
    const data = await api.schoolPost(body);
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
| **schoolLoginRequest** | [SchoolLoginRequest](SchoolLoginRequest.md) |  | |

### Return type

[**JwtTokenSchoolResponse**](JwtTokenSchoolResponse.md)

### Authorization

[X-API-KEY-SCHOOL](../README.md#X-API-KEY-SCHOOL), [X-API-KEY](../README.md#X-API-KEY), [X-API-KEY-USER](../README.md#X-API-KEY-USER), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | JWT erfolgreich erzeugt |  -  |
| **400** | Bad Request: Fehlende oder fehlerhafte Werte im Schema |  -  |
| **401** | Authentifizierung fehlgeschlagen |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## studentPost

> JwtTokenUserResponse studentPost(studentLoginRequest)

Schüler*in anmelden

Authentifiziert einen Schueler ueber surveyId, Klassenpasswort und Login-Code. Bei gueltigen Zugangsdaten wird ein Bearer-JWT zurueckgegeben.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { StudentPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: X-API-KEY-SCHOOL
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY
    apiKey: "YOUR API KEY",
    // To configure API key authorization: X-API-KEY-USER
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthApi(config);

  const body = {
    // StudentLoginRequest
    studentLoginRequest: {"surveyId":302,"loginPw":"KlassenPW","loginCode":"abc123de"},
  } satisfies StudentPostRequest;

  try {
    const data = await api.studentPost(body);
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
| **studentLoginRequest** | [StudentLoginRequest](StudentLoginRequest.md) |  | |

### Return type

[**JwtTokenUserResponse**](JwtTokenUserResponse.md)

### Authorization

[X-API-KEY-SCHOOL](../README.md#X-API-KEY-SCHOOL), [X-API-KEY](../README.md#X-API-KEY), [X-API-KEY-USER](../README.md#X-API-KEY-USER), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | JWT erfolgreich erzeugt |  -  |
| **400** | Bad Request: Fehlende oder fehlerhafte Werte im Schema |  -  |
| **401** | Authentifizierung fehlgeschlagen |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

