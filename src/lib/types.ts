export type ReflectanceSpectrum = {
	"@_ColorSpecification": string;
	"@_MeasureDate"?: string;
	"@_Name": string;
	"@_StartWL": string;
	"#text": string;
};

export type ColorSpecification = {
	"@_Id": string;
	"cc:TristimulusSpec": {
		"cc:Illuminant": "D50" | "D65" | string;
		"cc:Observer": "2_Degree" | "10_Degree" | string;
		"cc:Method"?: string;
	};
	"cc:MeasurementSpec"?: {
		"cc:MeasurementType"?: string;
		"cc:GeometryChoice"?: any;
		"cc:WavelengthRange"?: {
			"@_Increment": string;
			"@_StartWL": string;
		};
		"cc:CalibrationStandard"?: string;
		"cc:Aperture"?: string;
		"cc:Device"?: {
			"cc:Model"?: string;
			"cc:DeviceFilter"?: string;
			"cc:DevicePolarization"?: string | boolean;
		};
	};
};

export type CxFFile = {
	"cc:CxF": {
		"cc:FileInformation"?: {
			"cc:Creator"?: string;
			"cc:CreationDate"?: string;
			"cc:Tag"?: Array<{
				"@_Name": string;
				"@_Value": string;
			}>;
		};

		"cc:Resources"?: {
			"cc:ObjectCollection"?: {
				"cc:Object": {
					"@_GUID": string;
					"@_Id": string;
					"@_Name": string;
					"@_ObjectType": string;
					"cc:ColorValues": {
						"cc:ReflectanceSpectrum": ReflectanceSpectrum[];
					};
				};
			};

			"cc:ColorSpecificationCollection"?: {
				"cc:ColorSpecification": ColorSpecification[];
			};
		};
	};
};
