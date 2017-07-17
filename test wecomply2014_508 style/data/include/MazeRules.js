var maze_num = 1;
var maze_image, maze_image_inactive;
var theBGcolor = '000033';
var sprite_image;
var qmark1_xpos,qmark1_ypos,qmark2_xpos,qmark2_ypos,qmark3_xpos,qmark3_ypos,qmark4_xpos,qmark4_ypos;
var qmark5_xpos,qmark5_ypos,qmark6_xpos,qmark6_ypos,qmark7_xpos,qmark7_ypos,qmark8_xpos,qmark8_ypos;
var u, d, l, r;

function setupRules()
{
	switch (top.nMaze)
	{
		case 1:
		{
			// set question mark positions
			qmark1_xpos = 1;qmark1_ypos = 3
			qmark2_xpos = 3;qmark2_ypos = 5
			qmark3_xpos = 6;qmark3_ypos = 2
			qmark4_xpos = 8;qmark4_ypos = 3
			qmark5_xpos = 12;qmark5_ypos = 3
			qmark6_xpos = 15;qmark6_ypos = 5
			qmark7_xpos = 17;qmark7_ypos = 3
			qmark8_xpos = 20;qmark8_ypos = 2

			maze_image = 'mazeImages/maze20x5a.gif'
			maze_image_inactive = 'mazeImages/maze20x5a_inactive.gif'

			u=1;d=0;l=0;r=0;  // legal start direction
			sprite_image = 'mazeImages/sprite_u.gif' // starting sprite image
		
			break;
		}
		
		case 2:
		{
			// set question mark positions
			qmark1_xpos = 4;qmark1_ypos = 4
			qmark2_xpos = 5;qmark2_ypos = 2
			qmark3_xpos = 9;qmark3_ypos = 2
			qmark4_xpos = 12;qmark4_ypos = 3
			qmark5_xpos = 14;qmark5_ypos = 4
			qmark6_xpos = 16;qmark6_ypos = 4
			qmark7_xpos = 18;qmark7_ypos = 2
			qmark8_xpos = 20;qmark8_ypos = 2

			maze_image = 'mazeImages/maze20x5b.gif'
			maze_image_inactive = 'mazeImages/maze20x5b_inactive.gif'

			u=0;d=0;l=0;r=1;  // legal start direction
			sprite_image = 'mazeImages/sprite_r.gif' // starting sprite image

			break;
		}
		
		case 3:
		{
			// set question mark positions
			qmark1_xpos = 5;qmark1_ypos = 4
			qmark2_xpos = 5;qmark2_ypos = 2
			qmark3_xpos = 9;qmark3_ypos = 2
			qmark4_xpos = 12;qmark4_ypos = 2
			qmark5_xpos = 16;qmark5_ypos = 1
			qmark6_xpos = 16;qmark6_ypos = 4
			qmark7_xpos = 17;qmark7_ypos = 2
			qmark8_xpos = 19;qmark8_ypos = 1

			maze_image = 'mazeImages/maze20x5c.gif'
			maze_image_inactive = 'mazeImages/maze20x5c_inactive.gif'

			u=1;d=0;l=0;r=1;  // legal start direction
			sprite_image = 'mazeImages/sprite_u.gif' // starting sprite image

			break;
		}

		default:
			alert("invalid maze number " + top.nMaze);
			break;
	}
}

function testPos()
{
	switch (top.nMaze)
	{
		case 1:
		{
			if (horLevel(1)) {
				if (verLevel(1)) {u=0;d=1;l=0;r=1}
					if (verLevel(2)) {u=0;d=0;l=1;r=1}
						if (verLevel(3)) {u=0;d=1;l=1;r=0}
							if (verLevel(4)) {u=0;d=1;l=0;r=1}
								if (verLevel(5)) {u=0;d=0;l=1;r=1}
									if (verLevel(6)) {u=0;d=0;l=1;r=1}
										if (verLevel(7)) {u=0;d=1;l=1;r=0}
											if (verLevel(8)) {u=0;d=1;l=0;r=1}
												if (verLevel(9)) {u=0;d=0;l=1;r=1}
													if (verLevel(10)) {u=0;d=0;l=1;r=1}
														if (verLevel(11)) {u=0;d=1;l=1;r=1}
															if (verLevel(12)) {u=0;d=0;l=1;r=1}
																if (verLevel(13)) {u=0;d=0;l=1;r=1}
																	if (verLevel(14)) {u=0;d=1;l=1;r=0}
																		if (verLevel(15)) {u=0;d=1;l=0;r=1}
																			if (verLevel(16)) {u=0;d=0;l=1;r=1}
																				if (verLevel(17)) {u=0;d=1;l=1;r=1}
																					if (verLevel(18)) {u=0;d=0;l=1;r=0}
																						if (verLevel(19)) {u=0;d=1;l=0;r=0}
																							if (verLevel(20)) {u=0;d=1;l=0;r=0; finished(); return true;}
			}		
			if (horLevel(2)) {
				if (verLevel(1)) {u=1;d=0;l=0;r=1}
					if (verLevel(2)) {u=0;d=1;l=1;r=0}
						if (verLevel(3)) {u=1;d=0;l=0;r=1}
							if (verLevel(4)) {u=1;d=0;l=1;r=0}
								if (verLevel(5)) {u=0;d=1;l=0;r=1}
									if (verLevel(6)) {u=0;d=1;l=1;r=0; if (qstShow(3)) return true;}
										if (verLevel(7)) {u=1;d=0;l=0;r=1}
											if (verLevel(8)) {u=1;d=0;l=1;r=0}
												if (verLevel(9)) {u=0;d=1;l=0;r=1;qstmarkShow(5)}
													if (verLevel(10)) {u=0;d=1;l=1;r=0}
														if (verLevel(11)) {u=1;d=0;l=0;r=1}
															if (verLevel(12)) {u=0;d=0;l=1;r=1}
																if (verLevel(13)) {u=0;d=1;l=1;r=0}
																	if (verLevel(14)) {u=1;d=0;l=0;r=1}
																		if (verLevel(15)) {u=1;d=0;l=1;r=0}
																			if (verLevel(16)) {u=0;d=1;l=0;r=0}
																				if (verLevel(17)) {u=1;d=0;l=0;r=0}
																					if (verLevel(18)) {u=0;d=1;l=0;r=1}
																						if (verLevel(19)) {u=1;d=0;l=1;r=0}
																							if (verLevel(20)) {u=1;d=1;l=0;r=0; if (qstShow(8)) return true;}
			}
			if (horLevel(3)) {
				if (verLevel(1)) {u=0;d=1;l=0;r=1; if (qstShow(1)) return true;}
					if (verLevel(2)) {u=1;d=0;l=1;r=1}
						if (verLevel(3)) {u=0;d=1;l=1;r=0;qstmarkShow(2)}
							if (verLevel(4)) {u=0;d=1;l=0;r=1}
								if (verLevel(5)) {u=1;d=0;l=1;r=0;qstmarkShow(3)}
									if (verLevel(6)) {u=1;d=1;l=0;r=0}
										if (verLevel(7)) {u=0;d=1;l=0;r=1}
											if (verLevel(8)) {u=0;d=0;l=1;r=1; if (qstShow(4)) return true;}
												if (verLevel(9)) {u=1;d=0;l=1;r=0}
													if (verLevel(10)) {u=1;d=0;l=0;r=1}
														if (verLevel(11)) {u=0;d=0;l=1;r=1}
															if (verLevel(12)) {u=0;d=1;l=1;r=0; if (qstShow(5)) return true;}
																if (verLevel(13)) {u=1;d=0;l=0;r=1}
																	if (verLevel(14)) {u=0;d=0;l=1;r=1}
																		if (verLevel(15)) {u=0;d=1;l=1;r=0}
																			if (verLevel(16)) {u=1;d=1;l=0;r=0}
																				if (verLevel(17)) {u=0;d=1;l=0;r=1; if (qstShow(7)) return true;}
																					if (verLevel(18)) {u=1;d=1;l=1;r=0}
																						if (verLevel(19)) {u=0;d=1;l=0;r=1}
																							if (verLevel(20)) {u=1;d=0;l=1;r=0}
			}
			if (horLevel(4)) {
				if (verLevel(1)) {u=1;d=1;l=0;r=0;qstmarkShow(1)}
					if (verLevel(2)) {u=0;d=1;l=0;r=1}
						if (verLevel(3)) {u=1;d=0;l=1;r=0}
							if (verLevel(4)) {u=1;d=1;l=0;r=1}
								if (verLevel(5)) {u=0;d=1;l=1;r=0}
									if (verLevel(6)) {u=1;d=0;l=0;r=1}
										if (verLevel(7)) {u=1;d=0;l=1;r=0;qstmarkShow(4)}
											if (verLevel(8)) {u=0;d=0;l=0;r=1}
												if (verLevel(9)) {u=0;d=1;l=1;r=0}
													//
														//
															if (verLevel(12)) {u=1;d=1;l=0;r=0}
																if (verLevel(13)) {u=0;d=1;l=0;r=1;qstmarkShow(6)}
																	if (verLevel(14)) {u=0;d=1;l=1;r=0}
																		if (verLevel(15)) {u=1;d=0;l=0;r=1}
																			if (verLevel(16)) {u=1;d=0;l=1;r=0}
																				if (verLevel(17)) {u=1;d=1;l=0;r=0}
																					if (verLevel(18)) {u=1;d=1;l=0;r=0}
																						if (verLevel(19)) {u=1;d=0;l=0;r=1;qstmarkShow(8)}
																							if (verLevel(20)) {u=0;d=1;l=1;r=0}
			}
			if (horLevel(5)) {
				if (verLevel(1)) {u=1;d=0;l=0;r=0}
					if (verLevel(2)) {u=1;d=0;l=0;r=1}
						if (verLevel(3)) {u=0;d=0;l=1;r=1; if (qstShow(2)) return true;}
							if (verLevel(4)) {u=1;d=0;l=1;r=0}
								if (verLevel(5)) {u=1;d=0;l=0;r=1}
									if (verLevel(6)) {u=0;d=0;l=1;r=1}
										if (verLevel(7)) {u=0;d=0;l=1;r=1}
											if (verLevel(8)) {u=0;d=0;l=1;r=1}
												if (verLevel(9)) {u=1;d=0;l=1;r=0}
													//
														//
															if (verLevel(12)) {u=1;d=0;l=0;r=1}
																if (verLevel(13)) {u=1;d=0;l=1;r=0}
																	if (verLevel(14)) {u=1;d=0;l=0;r=1}
																		if (verLevel(15)) {u=0;d=0;l=1;r=1; if (qstShow(6)) return true;}
																			if (verLevel(16)) {u=0;d=0;l=1;r=1}
																				if (verLevel(17)) {u=1;d=0;l=1;r=0;qstmarkShow(7)}
																					if (verLevel(18)) {u=1;d=0;l=0;r=1}
																						if (verLevel(19)) {u=0;d=0;l=1;r=1}
																							if (verLevel(20)) {u=1;d=0;l=1;r=0}
			}
	
			break;
		}

		case 2:
		{
			if (horLevel(1)) {
				if (verLevel(1)) {u=0;d=1;l=0;r=0}
					if (verLevel(2)) {u=0;d=1;l=0;r=1}
						if (verLevel(3)) {u=0;d=0;l=1;r=1}
							if (verLevel(4)) {u=0;d=0;l=1;r=0}
								if (verLevel(5)) {u=0;d=0;l=0;r=1}
									if (verLevel(6)) {u=0;d=0;l=1;r=1}
										if (verLevel(7)) {u=0;d=1;l=1;r=1}
											if (verLevel(8)) {u=0;d=0;l=1;r=1}
												if (verLevel(9)) {u=0;d=0;l=1;r=1}
													if (verLevel(10)) {u=0;d=0;l=1;r=1}
														if (verLevel(11)) {u=0;d=1;l=1;r=0}
															if (verLevel(12)) {u=0;d=0;l=0;r=1}
																if (verLevel(13)) {u=0;d=0;l=1;r=1}
																	if (verLevel(14)) {u=0;d=1;l=1;r=0}
																		if (verLevel(15)) {u=0;d=1;l=0;r=1}
																			if (verLevel(16)) {u=0;d=0;l=1;r=1}
																				if (verLevel(17)) {u=0;d=0;l=1;r=1}
																					if (verLevel(18)) {u=0;d=0;l=1;r=1}
																						if (verLevel(19)) {u=0;d=1;l=1;r=0}
																							if (verLevel(20)) {u=0;d=1;l=0;r=0; finished(); return true;}
			}		
			if (horLevel(2)) {
				if (verLevel(1)) {u=1;d=0;l=0;r=1}
					if (verLevel(2)) {u=1;d=1;l=1;r=0}
						if (verLevel(3)) {u=0;d=1;l=0;r=1}
							if (verLevel(4)) {u=0;d=0;l=1;r=1}
								if (verLevel(5)) {u=0;d=1;l=1;r=1; if (qstShow(2)) return true;}
									if (verLevel(6)) {u=0;d=1;l=1;r=0}
										if (verLevel(7)) {u=1;d=1;l=0;r=0}
											if (verLevel(8)) {u=0;d=1;l=0;r=1}
												if (verLevel(9)) {u=0;d=0;l=1;r=1; if (qstShow(3)) return true;}
													if (verLevel(10)) {u=0;d=1;l=1;r=0}
														if (verLevel(11)) {u=1;d=0;l=0;r=1}
															if (verLevel(12)) {u=0;d=0;l=1;r=1}
																if (verLevel(13)) {u=0;d=1;l=1;r=0}
																	if (verLevel(14)) {u=1;d=1;l=0;r=1}
																		if (verLevel(15)) {u=1;d=0;l=1;r=0}
																			if (verLevel(16)) {u=0;d=1;l=0;r=1;qstmarkShow(7)}
																				if (verLevel(17)) {u=0;d=0;l=1;r=1}
																					if (verLevel(18)) {u=0;d=1;l=1;r=0; if (qstShow(7)) return true;}
																						if (verLevel(19)) {u=1;d=0;l=0;r=0}
																							if (verLevel(20)) {u=1;d=1;l=0;r=0; if (qstShow(8)) return true;}
			}
			if (horLevel(3)) {
				if (verLevel(1)) {u=0;d=1;l=0;r=1}
					if (verLevel(2)) {u=1;d=0;l=1;r=0}
						if (verLevel(3)) {u=1;d=0;l=0;r=1;qstmarkShow(2)}
							if (verLevel(4)) {u=0;d=1;l=1;r=0}
								if (verLevel(5)) {u=1;d=1;l=0;r=0}
									if (verLevel(6)) {u=1;d=0;l=0;r=1}
										if (verLevel(7)) {u=1;d=0;l=1;r=1}
											if (verLevel(8)) {u=1;d=0;l=1;r=0;qstmarkShow(3)}
												if (verLevel(9)) {u=0;d=1;l=0;r=0}
													if (verLevel(10)) {u=1;d=0;l=0;r=1;qstmarkShow(4)}
														if (verLevel(11)) {u=0;d=0;l=1;r=1}
															if (verLevel(12)) {u=0;d=1;l=1;r=0; if (qstShow(4)) return true;}
																if (verLevel(13)) {u=1;d=0;l=0;r=1}
																	if (verLevel(14)) {u=1;d=0;l=1;r=0}
																		if (verLevel(15)) {u=0;d=1;l=0;r=0}
																			if (verLevel(16)) {u=1;d=1;l=0;r=1}
																				if (verLevel(17)) {u=0;d=0;l=1;r=0}
																					if (verLevel(18)) {u=1;d=0;l=0;r=1}
																						if (verLevel(19)) {u=0;d=0;l=1;r=1;qstmarkShow(8)}
																							if (verLevel(20)) {u=1;d=0;l=1;r=0}
			}
			if (horLevel(4)) {
				if (verLevel(1)) {u=1;d=0;l=0;r=1}
					if (verLevel(2)) {u=0;d=0;l=1;r=1}
						if (verLevel(3)) {u=0;d=1;l=1;r=0}
							if (verLevel(4)) {u=1;d=1;l=0;r=0; if (qstShow(1)) return true;}
								if (verLevel(5)) {u=1;d=1;l=0;r=0}
									if (verLevel(6)) {u=0;d=1;l=0;r=1}
										if (verLevel(7)) {u=0;d=1;l=1;r=0}
											if (verLevel(8)) {u=0;d=0;l=0;r=1}
												if (verLevel(9)) {u=1;d=1;l=1;r=0}
													//
														//
															if (verLevel(12)) {u=1;d=1;l=0;r=0}
																if (verLevel(13)) {u=0;d=1;l=0;r=1}
																	if (verLevel(14)) {u=0;d=1;l=1;r=0; if (qstShow(5)) return true;}
																		if (verLevel(15)) {u=1;d=1;l=0;r=1}
																			if (verLevel(16)) {u=1;d=1;l=1;r=0; if (qstShow(6)) return true;}
																				if (verLevel(17)) {u=0;d=1;l=0;r=1}
																					if (verLevel(18)) {u=0;d=1;l=1;r=0}
																						if (verLevel(19)) {u=0;d=0;l=0;r=1}
																							if (verLevel(20)) {u=0;d=1;l=1;r=0}
			}
			if (horLevel(5)) {
				if (verLevel(1)) {u=0;d=0;l=0;r=1}
					if (verLevel(2)) {u=0;d=0;l=1;r=1}
						if (verLevel(3)) {u=1;d=0;l=1;r=1}
							if (verLevel(4)) {u=1;d=0;l=1;r=0;qstmarkShow(1)}
								if (verLevel(5)) {u=1;d=0;l=0;r=1}
									if (verLevel(6)) {u=1;d=0;l=1;r=0}
										if (verLevel(7)) {u=1;d=0;l=0;r=1}
											if (verLevel(8)) {u=0;d=0;l=1;r=1}
												if (verLevel(9)) {u=1;d=0;l=1;r=0}
													//
														//
															if (verLevel(12)) {u=1;d=0;l=0;r=1;qstmarkShow(5)}
																if (verLevel(13)) {u=1;d=0;l=1;r=0}
																	if (verLevel(14)) {u=1;d=0;l=0;r=1}
																		if (verLevel(15)) {u=1;d=0;l=1;r=0;qstmarkShow(6)}
																			if (verLevel(16)) {u=1;d=0;l=0;r=1}
																				if (verLevel(17)) {u=1;d=0;l=1;r=0}
																					if (verLevel(18)) {u=1;d=0;l=0;r=1}
																						if (verLevel(19)) {u=0;d=0;l=1;r=1}
																							if (verLevel(20)) {u=1;d=0;l=1;r=0}
			}
	
			break;
		}

		case 3:
		{
			if (horLevel(1)) {
				if (verLevel(1)) {u=0;d=1;l=0;r=1}
					if (verLevel(2)) {u=0;d=1;l=1;r=0}
						if (verLevel(3)) {u=0;d=0;l=0;r=1}
							if (verLevel(4)) {u=0;d=1;l=1;r=0}
								if (verLevel(5)) {u=0;d=1;l=0;r=1}
									if (verLevel(6)) {u=0;d=0;l=1;r=1}
										if (verLevel(7)) {u=0;d=1;l=1;r=1}
											if (verLevel(8)) {u=0;d=0;l=1;r=0}
												if (verLevel(9)) {u=0;d=1;l=0;r=1}
													if (verLevel(10)) {u=0;d=1;l=1;r=0}
														if (verLevel(11)) {u=0;d=1;l=0;r=1}
															if (verLevel(12)) {u=0;d=0;l=1;r=1}
																if (verLevel(13)) {u=0;d=0;l=1;r=0}
																	if (verLevel(14)) {u=0;d=1;l=0;r=1;qstmarkShow(5)}
																		if (verLevel(15)) {u=0;d=1;l=1;r=1}
																			if (verLevel(16)) {u=0;d=1;l=1;r=1; if (qstShow(5)) return true;}
																				if (verLevel(17)) {u=0;d=0;l=1;r=1}
																					if (verLevel(18)) {u=0;d=0;l=1;r=0}
																						if (verLevel(19)) {u=0;d=1;l=0;r=1; if (qstShow(8)) return true;}
																							if (verLevel(20)) {u=0;d=0;l=1;r=0; finished(); return true;}
			}		
			if (horLevel(2)) {
				if (verLevel(1)) {u=1;d=1;l=0;r=0}
					if (verLevel(2)) {u=1;d=0;l=0;r=1}
						if (verLevel(3)) {u=0;d=0;l=1;r=1}
							if (verLevel(4)) {u=1;d=0;l=1;r=0}
								if (verLevel(5)) {u=1;d=0;l=0;r=1; if (qstShow(2)) return true;}
									if (verLevel(6)) {u=0;d=1;l=1;r=0}
										if (verLevel(7)) {u=1;d=0;l=0;r=1;qstmarkShow(3)}
											if (verLevel(8)) {u=0;d=0;l=1;r=1}
												if (verLevel(9)) {u=1;d=1;l=1;r=0; if (qstShow(3)) return true;}
													if (verLevel(10)) {u=1;d=0;l=0;r=1}
														if (verLevel(11)) {u=1;d=0;l=1;r=0}
															if (verLevel(12)) {u=0;d=1;l=0;r=1; if (qstShow(4)) return true;}
																if (verLevel(13)) {u=0;d=1;l=1;r=0}
																	if (verLevel(14)) {u=1;d=1;l=0;r=0}
																		if (verLevel(15)) {u=1;d=0;l=0;r=0}
																			if (verLevel(16)) {u=1;d=1;l=0;r=0}
																				if (verLevel(17)) {u=0;d=1;l=0;r=1; if (qstShow(7)) return true;}
																					if (verLevel(18)) {u=0;d=0;l=1;r=1;qstmarkShow(8)}
																						if (verLevel(19)) {u=1;d=0;l=1;r=0}
																							if (verLevel(20)) {u=0;d=1;l=0;r=0}
			}
			if (horLevel(3)) {
				if (verLevel(1)) {u=1;d=0;l=0;r=1}
					if (verLevel(2)) {u=0;d=1;l=1;r=1}
						if (verLevel(3)) {u=0;d=0;l=1;r=1;qstmarkShow(1)}
							if (verLevel(4)) {u=0;d=0;l=1;r=1}
								if (verLevel(5)) {u=0;d=1;l=1;r=0}
									if (verLevel(6)) {u=1;d=1;l=0;r=0;qstmarkShow(2)}
										if (verLevel(7)) {u=0;d=1;l=0;r=1}
											if (verLevel(8)) {u=0;d=1;l=1;r=0}
												if (verLevel(9)) {u=1;d=0;l=0;r=1}
													if (verLevel(10)) {u=0;d=0;l=1;r=1;qstmarkShow(4)}
														if (verLevel(11)) {u=0;d=0;l=1;r=1}
															if (verLevel(12)) {u=1;d=0;l=1;r=0}
																if (verLevel(13)) {u=1;d=0;l=0;r=1}
																	if (verLevel(14)) {u=1;d=1;l=1;r=0}
																		if (verLevel(15)) {u=0;d=1;l=0;r=1;qstmarkShow(6)}
																			if (verLevel(16)) {u=1;d=0;l=1;r=0}
																				if (verLevel(17)) {u=1;d=0;l=0;r=1}
																					if (verLevel(18)) {u=0;d=1;l=1;r=0;qstmarkShow(7)}
																						if (verLevel(19)) {u=0;d=0;l=0;r=1}
																							if (verLevel(20)) {u=1;d=1;l=1;r=0}
			}
			if (horLevel(4)) {
				if (verLevel(1)) {u=0;d=1;l=0;r=1}
					if (verLevel(2)) {u=1;d=0;l=1;r=0}
						if (verLevel(3)) {u=0;d=1;l=0;r=1}
							if (verLevel(4)) {u=0;d=1;l=1;r=0}
								if (verLevel(5)) {u=1;d=0;l=0;r=1; if (qstShow(1)) return true;}
									if (verLevel(6)) {u=1;d=0;l=1;r=0}
										if (verLevel(7)) {u=1;d=1;l=0;r=0}
											if (verLevel(8)) {u=1;d=1;l=0;r=0}
												if (verLevel(9)) {u=0;d=1;l=0;r=0}
													//
														//
															if (verLevel(12)) {u=0;d=1;l=0;r=1}
																if (verLevel(13)) {u=0;d=0;l=1;r=1}
																	if (verLevel(14)) {u=1;d=0;l=1;r=0}
																		if (verLevel(15)) {u=1;d=0;l=0;r=1}
																			if (verLevel(16)) {u=0;d=0;l=1;r=1; if (qstShow(6)) return true;}
																				if (verLevel(17)) {u=0;d=1;l=1;r=0}
																					if (verLevel(18)) {u=1;d=1;l=0;r=1}
																						if (verLevel(19)) {u=0;d=1;l=1;r=0}
																							if (verLevel(20)) {u=1;d=1;l=0;r=0}
			}
			if (horLevel(5)) {
				if (verLevel(1)) {u=1;d=0;l=0;r=1}
					if (verLevel(2)) {u=0;d=0;l=1;r=1}
						if (verLevel(3)) {u=1;d=0;l=1;r=0}
							if (verLevel(4)) {u=1;d=0;l=0;r=1}
								if (verLevel(5)) {u=0;d=0;l=1;r=1}
									if (verLevel(6)) {u=0;d=0;l=1;r=1}
										if (verLevel(7)) {u=1;d=0;l=1;r=0}
											if (verLevel(8)) {u=1;d=0;l=0;r=1}
												if (verLevel(9)) {u=1;d=0;l=1;r=0}
													//
														//
															if (verLevel(12)) {u=1;d=0;l=0;r=1}
																if (verLevel(13)) {u=0;d=0;l=1;r=1}
																	if (verLevel(14)) {u=0;d=0;l=1;r=1}
																		if (verLevel(15)) {u=0;d=0;l=1;r=1}
																			if (verLevel(16)) {u=0;d=0;l=1;r=0}
																				if (verLevel(17)) {u=1;d=0;l=0;r=1}
																					if (verLevel(18)) {u=1;d=0;l=1;r=0}
																						if (verLevel(19)) {u=1;d=0;l=0;r=1}
																							if (verLevel(20)) {u=1;d=0;l=1;r=0}
			}
			break;
		}

		default:
			alert("invalid maze rule " + top.nMaze);
			break;
		
	}
	
	return false;
}