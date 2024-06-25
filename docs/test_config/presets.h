#ifdef CONFIG_PRESETS

Preset presets[] = {
	{ 
		"Stitched;common",  
		"",
		StylePtr<Stitched>(),
		StylePtr<Black>(),
		StylePtr<Black>(),
		"Stitched"
	},

	{ 
		"My;fallback;common",  
		"",
		StylePtr<ControlMainRandomFlickerTwoColorBaseColor>(),
		StylePtr<Black>(),
		StylePtr<Black>(),
		"MyBlade"
	},
	
	{ 
		"Deadlink;common", 
		"",
		StylePtr<InOutHelper<EASYBLADE(OnSpark<GREEN>, WHITE), 500, 1000> >(),
		StylePtr<Black>(),
		StylePtr<Black>(),
		"Deadlink"
	},
	
	{ 
		"SmthFuzz;common", 
		"",
		StyleNormalPtr<RED, WHITE, 300, 800>(),
		StylePtr<Black>(),
		StylePtr<Black>(),
		"SmthFuzz"
	},
	
	{ 
		"SmthGrey;common", 
		"",
		StylePtr<InOutSparkTip<EASYBLADE(MAGENTA, WHITE), 300, 800> >(),
		StylePtr<Black>(),
		StylePtr<Black>(),
		"SmthGrey"
	},

	{ 
		"TeensySF;common", 
		"",
		StyleNormalPtr<CYAN, WHITE, 300, 800>(),
		StylePtr<Black>(),
		StylePtr<Black>(),
		"TeensySF"
	},

	{ 
		"SmthJedi;common", 
		"",
		StylePtr<InOutSparkTip<EASYBLADE(BLUE, WHITE), 300, 800> >(),
		StylePtr<Black>(),
		StylePtr<Black>(),
		"SmthJedi"
	},

	{ 
		"SmthGrey;common", 
		"",
		StyleFirePtr<RED, YELLOW, 0>(),
		StylePtr<Black>(),
		StylePtr<Black>(),
		"SmthGrey"
	},

	{ 
		"RgueCmdr;common", 
		"",
		StyleFirePtr<BLUE, CYAN, 0>(),
		StylePtr<Black>(),
		StylePtr<Black>(),
		"RgueCmdr"
	},

	{ 
		"POV;fallback;common", 
		"",
		&style_pov,
		StylePtr<Black>(),
		StylePtr<Black>(),
		"POV"
	},
		
	{ 
		"Battery;fallback;common", 
		"",
		&style_charging,
		StylePtr<Black>(),
		StylePtr<Black>(),
		"Battery\nLevel"
	}

};

/*
Preset quad[] = {
	{
		"Stitched;common", "",
		StylePtr<ControlMainRandomFlickerTwoColorBaseColor>(""),
		StylePtr<MainRandomFlickerTwoColorBaseColor>(""),
		StylePtr<MainRandomFlickerTwoColorBaseColor>(""),
		StylePtr<MainRandomFlickerTwoColorBaseColor>(""),
		"Quad"
	}
};
*/


Preset no_blade[] = {
	{ 
		"NoBlade;fallback;common", 
		"",
		StylePtr<Black>(),
		StylePtr<AccentPower>(""),
		StylePtr<AccentPower>(""),
		"NoBlade"
	}
};


#include "blades.h"
#endif
