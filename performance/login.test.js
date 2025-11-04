import http from 'k6/http'
import { sleep, check} from 'k6'

export const options = {
    iterations: 1,
    thresholds: {
        http_req_duration: ['p(90)<10']
    }
}

export default function () {
    const url = 'http://localhost:3000/auth/login'

    const payload = JSON.stringify({
        email: 'fiel01@fiel.com',
        password: '1910'
    })

    const params = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const res = http.post(url, payload, params)
    check(res, {
        'Validar que o Status é 200': (r) => r.status === 200,
        'Validar que o Token é string': (r) => typeof(r.json().token) == "string"
    })

    sleep(1)


}