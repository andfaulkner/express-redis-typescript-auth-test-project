/**************************************************************************************************
*
*            Application configuration, e.g. server ports, db names
*
*/

export const config = {
    appTitle: 'express-typescript-react-mobx-boilerplate',
    port: {
        server: 8080
    },
    auth: {
        token: {
            secret: 'veIrgisuHbsrilguhw5e098tw45HgpiuBHrt08g9u45eh98t4345erUyHrtgjrorjopigIGRJIO' +
                    'ghiHRIOGuoKLCMlSDPOIVWEJgfsJfoierjgmekalfmveripojOIADGUSPoeiGVSDOIfGhpersot' +
                    'WIEUHbvehrvhourghwriothprygiuhiu45rhgseirogjrwopidthgviojeuehvieurhgeiughvs' +
                    'opirgjersoIOJ7SFPIU2HvpiOJGOIJRGoeijgoeisvPoIJEGoPIKBgOIrtjgOJRergOIrthHJrt' +
                    'Rgmroisgjsoigr3453tgeqrgerhb5e6h5j758k879lrtgehetyj67i6rtj5e6u457hbw456u58o' +
                    '6897okjuhywrtevafbturi56r5tgretyjtrweqrfrgtyjr7truye567857543i54u6io3u5ye45' +
                    'tg8use0hes980jvcu2i43nveru90iqghru04eiwf3incmcwmeiruUweEkxoOkwe49vne943KR03' +
                    'hE56GyUHesiurijsrhDrsIth5munytuiyer7543yewj349ROdogijetjkIUHEF843ng845nfvmc' +
                    'nrEie50jijvnhOrsi867890t4ksOcm9n',
            issuer: 'CANImmunize',
            audience: 'CANImmunize'   
        },
        expiry: 1440 // in minutes ?
    }
};                                   

// ---> (cutoff of equivalent tokens to the right) --->                                                                                                                                                                                                                                                                                                                       |<---first non-identical char
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lZWthIiwicEhhc2giOiJyNXY1dW9kTXUxcE9lc0owUllsY20wYWltbzVjcDZvQTRJSWpielIzbXEvT3ljZEU3VjV2YnckQVRrdjBoUlZsNVh1YzUvNE9rSHBNZHlMcm5odEM3ZkdpUXJwZmlmVEJUQSIsInNhbHQiOiLvv73vv73vv73vv73vv71M77-9Wk5677-9dEXvv71cXO-_vUbvv73vv73vv71cXO-_ve-_vVx1MDAwMO-_ve-_vSNvNHfvv73vv73vv73vv73vv71E77-9Xm9vIiwiaWF0IjoxNDgzNDAyNDY5LCJleHAiOjE0ODM0MDM5MDl9.oEwioVR41SHYaYMv441aho_wk4jIV6zjzeyMbojG5Es
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lZWthIiwicEhhc2giOiJyNXY1dW9kTXUxcE9lc0owUllsY20wYWltbzVjcDZvQTRJSWpielIzbXEvT3ljZEU3VjV2YnckQVRrdjBoUlZsNVh1YzUvNE9rSHBNZHlMcm5odEM3ZkdpUXJwZmlmVEJUQSIsInNhbHQiOiLvv73vv73vv73vv73vv71M77-9Wk5677-9dEXvv71cXO-_vUbvv73vv73vv71cXO-_ve-_vVx1MDAwMO-_ve-_vSNvNHfvv73vv73vv73vv73vv71E77-9Xm9vIiwiaWF0IjoxNDgzNDAyNDU2LCJleHAiOjE0ODM0MDM4OTZ9.72o3-jZfoZL0IEtHdOw69YAn12GkM_GO5fWiJmjH_4k