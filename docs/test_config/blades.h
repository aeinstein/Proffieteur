

// Mit 2 Datenleitungen, ein 2 Ringe, gedimmt
BladeConfig blades[] = {
	/*
	{ 
		50000, 
		WS281XBladePtr<122, bladePin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >(),
		DimBlade(10, SubBladeWithStride(0, 14, 2, WS281XBladePtr<16, blade2Pin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >())),  
		DimBlade(10, SubBladeWithStride(1, 15, 2, NULL)), 
		CONFIGARRAY(presets) 
	},

	{ 
		700000, 
		WS281XBladePtr<16, bladePin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >(),
		DimBlade(10, SubBladeWithStride(0, 14, 2, NULL)),  
		DimBlade(10, SubBladeWithStride(1, 15, 2, NULL)), 
		CONFIGARRAY(no_blade) 
	},
	*/


	{ 
		50000,
		WS281XBladePtr<122, bladePin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >(),
		SimpleBladePtr<NoLED, NoLED, NoLED, NoLED, -1, -1, -1, -1>(),
		SimpleBladePtr<NoLED, NoLED, NoLED, NoLED, -1, -1, -1, -1>(),
		CONFIGARRAY(presets) 
	},

	{ 
		100000,
		WS281XBladePtr<474, bladePin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >(),
		DimBlade(30, SubBladeWithStride(0, 14, 2, WS281XBladePtr<16, blade2Pin, Color8::GRB, PowerPINS<bladePowerPin2> >())),  
		DimBlade(70, SubBladeWithStride(1, 15, 2, NULL)), 
		CONFIGARRAY(presets) 
	},
	
	{ 
		500000, 
		WS281XBladePtr<1, bladePin, Color8::GRB, PowerPINS<bladePowerPin2> >(),
		DimBlade(30, SubBladeWithStride(0, 14, 2, WS281XBladePtr<16, blade2Pin, Color8::GRB, PowerPINS<bladePowerPin2> >())),  
		DimBlade(70, SubBladeWithStride(1, 15, 2, NULL)), 
		CONFIGARRAY(no_blade), "no_blade_save" 
	}
	

	
	/*
	
	{
		100000,
		SubBladeWithStride(0, 470, 4, WS281XBladePtr<474, bladePin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >()),
		SubBladeWithStride(1, 471, 4, NULL),
		SubBladeWithStride(2, 472, 4, NULL),
		SubBladeWithStride(3, 473, 4, NULL),
		CONFIGARRAY(quad)
	},
	
	{
		500000,
		SimpleBladePtr<NoLED, NoLED, NoLED, NoLED, -1, -1, -1, -1>(),
		DimBlade(30, SubBladeWithStride(0, 14, 2, WS281XBladePtr<16, blade2Pin, Color8::GRB, PowerPINS<bladePowerPin2> >())),  
		DimBlade(30, SubBladeWithStride(1, 15, 2, NULL)), 
		SimpleBladePtr<NoLED, NoLED, NoLED, NoLED, -1, -1, -1, -1>(),
		CONFIGARRAY(no_blade), "no_blade_save"
	}
	*/

};


/*
// Mit 2 Datenleitungen als 2 Ringe
BladeConfig blades[] = {
 { 0, WS281XBladePtr<477, bladePin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >(),
    SubBladeWithStride(0, 15, 2, WS281XBladePtr<16, blade2Pin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >()),
    SubBladeWithStride(1, 15, 2, NULL)
  , CONFIGARRAY(presets) }
};
*/


/*
// In Serie als 2 Ringe und gedimmt
BladeConfig blades[] = {
 { 0, 
	SubBladeWithStride(16, 490, 1, WS281XBladePtr<493, bladePin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >()),
    DimBlade(10, SubBladeWithStride(0, 14, 2, NULL)),
    DimBlade(10, SubBladeWithStride(1, 15, 2, NULL))
  , CONFIGARRAY(presets) }
};
*/

/*
// In Serie als 2 Ringe
BladeConfig blades[] = {
{	// Tritium 474 Leds
	0, 
	SubBlade(16, 490, WS281XBladePtr<490, bladePin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >()),
    DimBlade(10, SubBladeWithStride(0, 14, 2, NULL)),
    DimBlade(10, SubBladeWithStride(1, 15, 2, NULL)), 
	CONFIGARRAY(presets) 
},

{	// NeoPixel 122 Leds
	50000, 
	SubBlade(16, 138, WS281XBladePtr<138, bladePin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >()),
    DimBlade(10, SubBladeWithStride(0, 14, 2, NULL)),
    DimBlade(10, SubBladeWithStride(1, 15, 2, NULL)), 
	CONFIGARRAY(presets) 
},

{	// NO_BLADE
	200000, 
    SubBlade(16, 16, WS281XBladePtr<16, bladePin, Color8::GRB, PowerPINS<bladePowerPin2, bladePowerPin3, bladePowerPin4, bladePowerPin5> >()),
    DimBlade(10, SubBladeWithStride(0, 14, 2, NULL)),
    DimBlade(10, SubBladeWithStride(1, 15, 2, NULL)), 
	CONFIGARRAY(no_blade),
	"no_blade_Save"	
}
};
*/
