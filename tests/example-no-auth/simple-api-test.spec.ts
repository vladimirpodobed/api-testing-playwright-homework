import { StatusCodes } from 'http-status-codes'
import { expect, test } from '@playwright/test'
import { ProductDto } from '../dto/product-dto'

test('get product with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://shop.tl-academy.ee/api/products/1', {
    ignoreHTTPSErrors: true,
  })

  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status, body and headers
  console.log('response body:', responseBody)
  // Check if the response status is 200
  expect(statusCode).toBe(StatusCodes.OK)
})

test('get non-existing product should receive code 404', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://shop.tl-academy.ee/api/products/99', {
    ignoreHTTPSErrors: true,
  })

  // parse raw response body to json
  // const responseBody = await response.json() nothing to transfer to body
  const statusCode = response.status()

  // Log the response status, body and headers
  //console.log('response body:', responseBody)
  // Check if the response status is 200
  expect(statusCode).toBe(StatusCodes.NOT_FOUND)
})

test('get product with invalid id should receive code 400', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://shop.tl-academy.ee/api/products/abc', {
    ignoreHTTPSErrors: true,
  })

  // parse raw response body to json
  // const responseBody = await response.json() nothing to transfer to body
  const statusCode = response.status()

  // Log the response status, body and headers
  //console.log('response body:', responseBody)
  // Check if the response status is 200
  expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
})

// Создаём тест: проверяем, что при отправке корректных данных сервер возвращает статус 201 (Created)
test('post product with correct data should receive code 201', async ({ request }) => {
  // Создаём объект с данными продукта с помощью класса ProductDto
  const requestBody = new ProductDto('Orange', 'Fruit', 2.39, 0)

  // Отправляем POST-запрос на сервер, чтобы создать новый продукт
  const response = await request.post('https://shop.tl-academy.ee/api/products', {
    data: requestBody, // Передаём данные продукта в теле HTTP-запроса
    ignoreHTTPSErrors: true, // Разрешаем запрос, даже если есть ошибки HTTPS-сертификата
  }) // Завершаем отправку запроса и сохраняем ответ сервера в response

  // Читаем тело ответа сервера и преобразуем JSON в JavaScript-объект
  const responseBody = await response.json()

  // Получаем HTTP-статус ответа сервера, например 201
  const statusCode = response.status()

  // Выводим HTTP-статус ответа в консоль
  console.log('response status:', statusCode)

  // Выводим тело ответа сервера в консоль
  console.log('response body:', responseBody)

  // Проверяем, что сервер вернул статус 201 — продукт успешно создан
  expect(statusCode).toBe(StatusCodes.CREATED)

  // Проверяем, что свойство name в ответе имеет тип string
  expect(typeof responseBody.name).toBe('string')

  // Проверяем, что свойство price в ответе имеет тип number
  expect(typeof responseBody.price).toBe('number')
}) // Завершаем описание теста

test('post product with correct mandatory data and quantity should receive code 201', async ({
  request,
}) => {
  // prepare request body with only mandatory fields
  const requestBody = {
    name: 'Banana',
    category: 'Fruit',
    price: 2.5,
    quantity: 20, //optional fields set explicitly
  }
  // Send a POST request to the server
  const response = await request.post('https://shop.tl-academy.ee/api/products', {
    data: requestBody,
    ignoreHTTPSErrors: true,
  })
  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status and body
  console.log('response status:', statusCode)
  console.log('response body:', responseBody)
  expect(statusCode).toBe(StatusCodes.CREATED)
  // check that body.name is string type
  expect(typeof responseBody.name).toBe('string')
  // check that body.price is number type
  expect(typeof responseBody.price).toBe('number')
  expect(responseBody.quantity).toBe(20)
  expect(responseBody.available).toBeTruthy()
})

test('Failed to create product with missing mandatory name should receive code 400', async ({
  request,
}) => {
  // prepare request body with only mandatory fields
  /*const requestBody = {
    //name: 'Banana',
    category: 'Fruit',
    price: 2.5,
    quantity: 20, //optional fields set explicitly
  }*/

  const requestBody = new ProductDto('Kiwi', '', 2.5, 25)
  // Send a POST request to the server
  const response = await request.post('https://shop.tl-academy.ee/api/products', {
    data: requestBody,
    ignoreHTTPSErrors: true,
  })
  // parse raw response body to json
  //const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status and body
  console.log('response status:', statusCode)
  //console.log('response body:', responseBody)
  expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
  // check that body.name is string type
  //expect(typeof responseBody.name).toBe('string')
  // check that body.price is number type
  //expect(typeof responseBody.price).toBe('number')
  //expect(responseBody.quantity).toBe(20)
  //expect(responseBody.available).toBeTruthy()
})

test('Failed to create product with invalid price should receive code 400', async ({ request }) => {
  const requestBody = new ProductDto('', 'Fruit', 0, 25)
  // Send a POST request to the server
  const response = await request.post('https://shop.tl-academy.ee/api/products', {
    data: requestBody,
    ignoreHTTPSErrors: true,
  })

  const statusCode = response.status()

  // Log the response status and body
  console.log('response status:', statusCode)
  //console.log('response body:', responseBody)
  expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
})
