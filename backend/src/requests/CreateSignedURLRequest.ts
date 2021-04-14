// References:
// https://github.com/vturbin/Serverless-Project
export interface CreateSignedURLRequest {
    Bucket: string,
    Key: string,
    Expires: string
}