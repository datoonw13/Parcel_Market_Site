"use server"

export const signInUser = async (prevState: any, formData: any) => {
    console.log(prevState, formData)
    return {
        error: true,
        message: 'success'
    }
}
