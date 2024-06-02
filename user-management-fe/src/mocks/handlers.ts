import { http, HttpResponse, delay } from "msw"

export const handlers = [
  
  http.post('/login', async ({ request }) => {
    
    await delay(1000)

    return HttpResponse.json({
      message: "Login successful"
    }, {
      status: 401
    })
  })
]