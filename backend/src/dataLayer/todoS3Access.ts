import {CreateSignedURLRequest} from '../requests/CreateSignedURLRequest'

import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoS3Access {
    constructor(
        private readonly todoS3BucketName = process.env.IMAGES_S3_BUCKET,
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'})
    ) {}

    getBucketName() {
        return this.todoS3BucketName
    }
    
    getPreSignedUploadURL(createSignedURLRequest: CreateSignedURLRequest) {
        return this.s3.getSignedUrl(
            'putObject',
            createSignedURLRequest    
        )
    }
}