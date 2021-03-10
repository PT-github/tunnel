{
	"version":"LAYASCENE3D:02",
	"data":{
		"type":"Scene3D",
		"props":{
			"name":"SampleScene",
			"ambientColor":[
				0.212,
				0.227,
				0.259
			],
			"reflectionDecodingFormat":1,
			"reflection":"Assets/Scenes/SampleSceneGIReflection.ltcb.ls",
			"reflectionIntensity":1,
			"ambientMode":1,
			"ambientSphericalHarmonics":[
				0.1678838,
				-0.01659165,
				-0.01137983,
				0.00656961,
				0.004985159,
				-0.008635049,
				0.009734819,
				-0.01030053,
				0.02333619,
				0.2107363,
				0.02701665,
				-0.0188861,
				0.01090373,
				0.008416965,
				-0.01457904,
				0.01416337,
				-0.01572322,
				0.03351215,
				0.2899413,
				0.1099665,
				-0.0348094,
				0.02009422,
				0.01630473,
				-0.02824404,
				0.01814265,
				-0.02374644,
				0.04080036
			],
			"ambientSphericalHarmonicsIntensity":1,
			"lightmaps":[],
			"enableFog":false,
			"fogStart":0,
			"fogRange":300,
			"fogColor":[
				0.5,
				0.5,
				0.5
			]
		},
		"child":[
			{
				"type":"DirectionLight",
				"instanceID":0,
				"props":{
					"name":"Directional Light",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						3,
						0
					],
					"rotation":[
						0.1530762,
						0.7788725,
						0.5712882,
						-0.2086982
					],
					"scale":[
						1,
						1,
						1
					],
					"intensity":0.3,
					"lightmapBakedType":1,
					"color":[
						0.8364238,
						0.8396226,
						0.7010057
					]
				},
				"components":[],
				"child":[]
			},
			{
				"type":"Camera",
				"instanceID":1,
				"props":{
					"name":"Main Camera",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						33.03283,
						19.03417,
						22.29521
					],
					"rotation":[
						-0.2170399,
						0.398689,
						0.09770102,
						0.885661
					],
					"scale":[
						1,
						1,
						1
					],
					"clearFlag":1,
					"orthographic":false,
					"orthographicVerticalSize":10,
					"fieldOfView":60,
					"enableHDR":true,
					"nearPlane":0.3,
					"farPlane":1000,
					"viewport":[
						0,
						0,
						1,
						1
					],
					"clearColor":[
						0.1372549,
						0.1529412,
						0.2588235,
						1
					]
				},
				"components":[],
				"child":[]
			}
		]
	}
}