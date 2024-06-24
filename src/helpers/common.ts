export const numFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const numericInput = (number: string) => {
    // You can modify the {0,2} to match your decimal preference {min, max}
    const regex = new RegExp(/^\d*(\.)?(\d{0,2})?$/)
    const isValid = regex.test(number)
    let res = null
    if(isValid && number.startsWith('.')) {
        res = `0${number}`
    }
    else {
        res = number
    }
    return  {
        valid: regex.test(number),
        value: res || null
    }
} 