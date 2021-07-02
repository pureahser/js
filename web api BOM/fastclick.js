; （函数 （） {
	“使用严格” ；

	/ **
	 * @preserve FastClick：polyfill可消除具有触摸UI的浏览器的点击延迟。
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright金融时报有限公司[保留所有权利]
	 * @license MIT许可证（请参阅LICENSE.txt）
	 * /

	/ * jslint浏览器：true，节点：true * /
	/ *全局定义，事件，节点* /


	/ **
	 *在指定层上实例化快速单击的侦听器。
	 *
	 * @构造函数
	 * @param { Element } layer监听的层
	 * @param { Object } [options = {}]覆盖默认值的选项
	 * /
	功能 FastClick （图层， 选项） {
		var  oldOnClick ;

		选项 =  选项 ||  { } ;

		/ **
		 *当前是否跟踪点击。
		 *
		 * @类型布尔
		 * /
		这个。trackingClick  =  false ;


		/ **
		 *点击跟踪开始的时间戳。
		 *
		 * @类型编号
		 * /
		这个。trackingClickStart  =  0 ;


		/ **
		 *跟踪点击的元素。
		 *
		 * @type EventTarget
		 * /
		这个。targetElement  =  null ;


		/ **
		 *触摸开始事件的X坐标。
		 *
		 * @类型编号
		 * /
		这个。touchStartX  =  0 ;


		/ **
		 *触摸开始事件的Y坐标。
		 *
		 * @类型编号
		 * /
		这个。touchStartY  =  0 ;


		/ **
		 *最后一次触摸的ID，从Touch.identifier中检索。
		 *
		 * @类型编号
		 * /
		这个。lastTouchIdentifier  =  0 ;


		/ **
		 *触摸移动边界，超过此边界将取消单击。
		 *
		 * @类型编号
		 * /
		这个。touchBoundary  =  选项。touchBoundary  ||  10 ；


		/ **
		 * FastClick层。
		 *
		 * @type元素
		 * /
		这个。层 =  层;

		/ **
		 *点击（触摸开始和触摸结束）事件之间的最短时间
		 *
		 * @类型编号
		 * /
		这个。tapDelay  =  选项。tapDelay  ||  200 ;

		/ **
		 *最长点击时间
		 *
		 * @类型编号
		 * /
		这个。tapTimeout  =  选项。tapTimeout  ||  700 ;

		如果 （FastClick 。notNeeded （层）） {
			回报;
		}

		//某些旧版本的Android没有Function.prototype.bind
		函数 绑定（方法， 上下文） {
			return  function （） {  返回 方法。适用（上下文， 论点）;  } ;
		}


		var  方法 =  [ 'onMouse' ， 'onClick' ， 'onTouchStart' ， 'onTouchMove' ， 'onTouchEnd' ， 'onTouchCancel' ] ；
		var  context  =  this ;
		for  （var  i  =  0 ， l  =  方法。长度;  i  <  l ;  i ++ ） {
			上下文[ 方法[ i ] ]  =  绑定（上下文[ 方法[ i ] ] ， 上下文）;
		}

		//根据需要设置事件处理程序
		如果 （deviceIsAndroid ） {
			层。的addEventListener （'鼠标悬停' ， 此。onMouse ， 真）;
			层。的addEventListener （'鼠标按下' ， 此。onMouse ， 真）;
			层。的addEventListener （'鼠标松开' ， 此。onMouse ， 真）;
		}

		层。的addEventListener （'点击' ， 这。的onClick ， 真正的）;
		层。的addEventListener （'touchstart' ， 此。onTouchStart ， 假）;
		层。的addEventListener （'touchmove' ， 此。onTouchMove ， 假）;
		层。的addEventListener （'touchend' ， 此。onTouchEnd ， 假）;
		层。的addEventListener （'touchcancel' ， 此。onTouchCancel ， 假）;

		//不支持Event＃stopImmediatePropagation的浏览器（例如Android 2）需要Hack
		//这是FastClick通常如何停止冒泡到在FastClick上注册的回调的点击事件的方式
		//取消时分层。
		如果 （！事件。原型。stopImmediatePropagation ） {
			层。removeEventListener  =  function （类型， 回调， 捕获） {
				var  rmv  =  节点。原型。removeEventListener ;
				如果 （类型 ===  '点击' ） {
					rmv 。调用（层， 类型， 回调。被劫持 ||  回调， 捕获）;
				}  其他 {
					rmv 。调用（层， 类型， 回调， 捕获）;
				}
			} ;

			层。addEventListener  =  function （类型， 回调， 捕获） {
				var  adv  =  Node 。原型。addEventListener ;
				如果 （类型 ===  '点击' ） {
					副词adv 。呼叫（图层， 类型， 回调。劫持 ||  （回调。劫持 =  函数（事件） {
						如果 （！事件。propagationStopped ） {
							回调（事件）;
						}
					} ）， 捕获）;
				}  其他 {
					副词adv 。调用（层， 类型， 回调， 捕获）;
				}
			} ;
		}

		//如果已在元素的onclick属性中声明了处理程序，则将在之前触发该处理程序
		// FastClick的onClick处理程序。通过拉出用户定义的处理程序函数来解决此问题，并
		//将其添加为侦听器。
		如果 （typeof运算 层。的onclick  ===  '功能' ） {

			//至少在3.2以上的Android浏览器需要对layer.onclick中的函数的新引用
			//-如果直接传递给addEventListener，则旧的将不起作用。
			oldOnClick  =  layer 。onclick ;
			层。addEventListener （'click' ， function （event ） {
				oldOnClick （事件）;
			} ， false ）;
			层。onclick  =  null ;
		}
	}

	/ **
	Windows Phone 8.1伪造用户代理字符串，看起来像Android和iPhone。
	*
	* @类型布尔
	* /
	var  deviceIsWindowsPhone  =  navigator 。userAgent 。indexOf （“ Windows Phone” ） > = 0 ;

	/ **
	 * Android需要例外。
	 *
	 * @类型布尔
	 * /
	var  deviceIsAndroid  =  navigator 。userAgent 。indexOf （'Android' ） >  0  &&！deviceIsWindowsPhone ;


	/ **
	 * iOS需要例外。
	 *
	 * @类型布尔
	 * /
	var  deviceIsIOS  =  / iP （ ad | hone | od ） / 。测试（导航仪。的userAgent ） &&！deviceIsWindowsPhone ;


	/ **
	 * iOS 4要求select元素有例外。
	 *
	 * @类型布尔
	 * /
	VAR  deviceIsIOS4  =  deviceIsIOS  &&  （/ OS 4_ \ d （ _ \ d ）？/ ）。测试（导航。的userAgent ）;


	/ **
	 * iOS 6.0-7。*需要手动导出目标元素
	 *
	 * @类型布尔
	 * /
	var  deviceIsIOSWithBadTarget  =  deviceIsIOS  &&  （/ OS [ 6-7 ] _ \ d / ）。测试（导航。的userAgent ）;

	/ **
	 * BlackBerry需要例外。
	 *
	 * @类型布尔
	 * /
	var  deviceIsBlackBerry10  =  导航器。userAgent 。indexOf （'BB10' ） >  0 ;

	/ **
	 *确定给定元素是否需要原生点击。
	 *
	 * @param { EventTarget | Element }目标Target DOM元素
	 * @returns { boolean }如果元素需要本地点击，则返回true
	 * /
	快速点击。原型。needsClick  =  函数（目标） {
		开关 （目标。nodeName的。toLowerCase （）） {

		//不要向无效输入发送综合点击（问题＃62）
		案例 “按钮”：
		案例 '选择'：
		案例 'textarea'：
			如果 （目标。禁用） {
				返回 true ;
			}

			休息;
		情况 “输入”：

			//由于浏览器错误（问题＃68），文件输入需要在iOS 6上进行实际点击
			如果 （（deviceIsIOS  &&  目标。键入 ===  '文件' ） ||  目标。禁用） {
				返回 true ;
			}

			休息;
		案例 '标签'：
		情况下， “IFRAME”：// iOS8上的主屏幕应用程序可以防止事件冒泡到帧
		案例 “视频”：
			返回 true ;
		}

		return  （/ \ b needsclick \ b / ）。试验（目标。的className ）;
	} ;


	/ **
	 *确定给定元素是否需要调用以聚焦以模拟元素点击。
	 *
	 * @param { EventTarget | Element }目标Target DOM元素
	 * @returns { boolean }如果元素需要调用以聚焦以模拟原生点击，则返回true。
	 * /
	快速点击。原型。needsFocus  =  函数（目标） {
		开关 （目标。nodeName的。toLowerCase （）） {
		案例 'textarea'：
			返回 true ;
		案例 '选择'：
			退货！deviceIsAndroid ;
		情况 “输入”：
			开关 （目标。类型） {
			案例 “按钮”：
			案例 “复选框”：
			案例 '文件'：
			案例 “图片”：
			案例 “收音机”：
			案例 “提交”：
				返回 false ;
			}

			//试图集中禁用的输入没有意义
			退货！目标。禁用 &&！目标。readOnly ;
		默认值：
			return  （/ \ b needsfocus \ b / ）。试验（目标。的className ）;
		}
	} ;


	/ **
	 *将click事件发送到指定的元素。
	 *
	 * @param { EventTarget | Element } targetElement
	 * @param { 事件 }事件
	 * /
	快速点击。原型。sendClick  =  函数（targetElement ， 事件） {
		var  clickEvent ， 触摸；

		//在某些Android设备上，需要对activeElement进行模糊处理，否则合成点击将无效（＃24）
		如果 （文件。activeElement  &&  文件。activeElement！== targetElement ） {
			文件。activeElement 。模糊（）;
		}

		touch  =  事件。changedTouches [ 0 ] ；

		//合成带有额外属性的click事件，因此可以对其进行跟踪
		clickEvent  =  document 。createEvent （'MouseEvents' ）;
		clickEvent 。initMouseEvent （此。determineEventType （targetElement ）， 真， 真， 窗口， 1 ， 触摸。screenX ， 触摸。screenY ， 触摸。clientX ， 触摸。clientY ， 假， 假， 假， 假， 0 ， 空）;
		clickEvent 。forwardedTouchEvent  =  true ;
		targetElement 。dispatchEvent （clickEvent ）;
	} ;

	快速点击。原型。确定事件类型 =  函数（targetElement ） {

		//问题＃159：Android Chrome选择框无法通过综合点击事件打开
		如果 （deviceIsAndroid  &&  targetElement 。的tagName 。toLowerCase （） ===  '选择' ） {
			返回 'mousedown' ;
		}

		返回 'click' ;
	} ;


	/ **
	 * @param { EventTarget | Element } targetElement
	 * /
	快速点击。原型。focus  =  function （targetElement ） {
		变 长;

		//问题＃160：在iOS 7上，某些输入元素（例如date datetime month）在setSelectionRange上引发模糊的TypeError。这些元素的selectionStart和selectionEnd属性没有整数值，但是很遗憾，这些元素不能用于检测，因为访问这些属性还会引发TypeError。只需检查类型即可。归档为Apple错误＃15122724。
		如果 （deviceIsIOS  &&  targetElement 。setSelectionRange  &&  targetElement 。类型。的indexOf （'日期' ） == 0  &&  targetElement 。类型！== '时间'  &&  targetElement 。类型！== '月'  &&  targetElement 。类型！== '电子邮件' ） {
			长度 =  targetElement 。价值。长度;
			targetElement 。setSelectionRange （length ， length ）;
		}  其他 {
			targetElement 。重点（）;
		}
	} ;


	/ **
	 *检查给定的目标元素是否为可滚动层的子级，如果是，则在其上设置一个标志。
	 *
	 * @param { EventTarget | Element } targetElement
	 * /
	快速点击。原型。updateScrollParent  =  函数（targetElement ） {
		var  scrollParent ， parentElement ;

		scrollParent  =  targetElement 。fastClickScrollParent ;

		//尝试发现目标元素是否包含在可滚动层中。重新检查
		//目标元素已移至另一个父元素。
		如果 （！scrollParent  ||！scrollParent 。包含（targetElement ）） {
			parentElement  =  targetElement ;
			做 {
				如果 （parentElement 。scrollHeight属性 >  parentElement 。的offsetHeight ） {
					scrollParent  =  parentElement ;
					targetElement 。fastClickScrollParent  =  parentElement ;
					休息;
				}

				parentElement  =  parentElement 。parentElement ;
			}  while  （parentElement ）;
		}

		//如果可能，请始终更新滚动顶部跟踪器。
		如果 （scrollParent ） {
			scrollParent 。fastClickLastScrollTop  =  scrollParent 。scrollTop ;
		}
	} ;


	/ **
	 * @param { EventTarget } targetElement
	 * @returns { Element | EventTarget }
	 * /
	快速点击。原型。getTargetElementFromEventTarget  =  函数（eventTarget ） {

		//在某些较旧的浏览器（尤其是iOS 4.1的Safari-请参阅问题＃56）上，事件目标可能是文本节点。
		如果 （的eventTarget 。节点类型 ===  节点。TEXT_NODE ） {
			返回 eventTarget 。parentNode ;
		}

		返回 eventTarget ;
	} ;


	/ **
	 *在触摸开始时，记录位置并滚动偏移量。
	 *
	 * @param { 事件 }事件
	 * @returns { 布尔 }
	 * /
	快速点击。原型。onTouchStart  =  函数（事件） {
		var  targetElement ， touch ， 选择;

		//忽略多次触摸，否则如果两根手指都在FastClick元素上（问题＃111），则可以防止捏住缩放。
		如果 （事件。targetTouches 。长度 >  1 ） {
			返回 true ;
		}

		targetElement  =  this 。getTargetElementFromEventTarget （事件。目标）;
		touch  =  事件。targetTouches [ 0 ] ;

		如果 （deviceIsIOS ） {

			//只有受信任的事件才会在iOS上取消选择文本（问题＃49）
			选择 =  窗口。getSelection （）;
			如果 （选择。rangeCount  &&！选择。isCollapsed ） {
				返回 true ;
			}

			如果 （！deviceIsIOS4 ） {

				//当通过点击事件回调（问题＃23）打开警报或确认对话框时，iOS上会发生奇怪的事情：
				//当用户下一次点击页面上的其他位置时，将调度新的touchstart和touchend事件
				//，其标识符与先前触发触发警报的点击的触摸事件相同。
				//可悲的是，iOS 4上存在一个问题，该问题导致某些正常的触摸事件具有与
				//立即发生触摸事件（事件＃52），因此该修复程序在该平台上不可用。
				//问题120：使用iOS设备UA字符串设置Chrome开发工具“模拟触摸事件”时，touch.identifier为0，
				//导致所有触摸事件被忽略。由于此代码块仅适用于iOS，并且iOS标识符始终很长，
				//随机整数，如果此处的标识符为0，则可以安全地继续。
				如果 （触摸。标识符 &&  触摸。标识符 ===  此。lastTouchIdentifier ） {
					事件。preventDefault （）;
					返回 false ;
				}

				这个。lastTouchIdentifier  =  touch 。标识符;

				//如果目标元素是可滚动层的子级（使用-webkit-overflow-scrolling：touch），并且：
				// 1）用户在可滚动层上进行快速滚动
				// 2）用户再次轻按即可停止滚动滚动
				//然后最后一个'touchend'事件的event.target将是用户手指下的元素
				//当开始滚动时，导致FastClick将click事件发送到该层-除非选中
				//可以确保在发送综合点击（问题＃42）之前未滚动父层。
				这个。updateScrollParent （targetElement ）;
			}
		}

		这个。trackingClick  =  true ;
		这个。trackingClickStart  =  event 。timeStamp ;
		这个。targetElement  =  targetElement ;

		这个。touchStartX  =  touch 。pageX ;
		这个。touchStartY  =  触摸。pageY ;

		//防止快速双击时幻像点击（问题＃36）
		如果 （（事件。的timeStamp  -  此。lastClickTime ） <  此。tapDelay ） {
			事件。preventDefault （）;
		}

		返回 true ;
	} ;


	/ **
	 *基于touchmove事件对象，检查自触摸开始以来是否已移过边界。
	 *
	 * @param { 事件 }事件
	 * @returns { 布尔 }
	 * /
	快速点击。原型。touchHasMoved  =  函数（事件） {
		var  touch  =  event 。changedTouches [ 0 ] ， boundary  =  this 。touchBoundary ;

		如果 （数学。ABS （触摸。pageX属性 -  此。touchStartX ） >  边界 ||  数学。ABS （触摸。pageY  -  此。touchStartY ） >  边界） {
			返回 true ;
		}

		返回 false ;
	} ;


	/ **
	 *更新最后位置。
	 *
	 * @param { 事件 }事件
	 * @returns { 布尔 }
	 * /
	快速点击。原型。onTouchMove  =  函数（事件） {
		如果 （！此。trackingClick ） {
			返回 true ;
		}

		//如果触摸已移动，请取消点击跟踪
		如果 （这个。targetElement！== 这个。getTargetElementFromEventTarget （事件。目标） ||  此。touchHasMoved （事件）） {
			这个。trackingClick  =  false ;
			这个。targetElement  =  null ;
		}

		返回 true ;
	} ;


	/ **
	 *尝试查找给定标签元素的带标签的控件。
	 *
	 * @param { EventTarget | HTMLLabelElement } labelElement
	 * @returns { 元素|空 }
	 * /
	快速点击。原型。findControl  =  function （labelElement ） {

		//支持HTML5控件属性的新型浏览器的快速路径
		如果 （labelElement 。控制！== 未定义） {
			返回 labelElement 。控制;
		}

		//所有受测试的支持触摸事件的浏览器也都支持HTML5 htmlFor属性
		如果 （labelElement 。htmlFor ） {
			退货 文件。的getElementById （labelElement 。htmlFor ）;
		}

		//如果不存在for属性，则尝试检索第一个labellable后代元素
		//在此处定义其列表：http://www.w3.org/TR/html5/forms.html#category-label
		返回 labelElement 。querySelector （'button，input：not（[type = hidden]），keygen，meter，输出，progress，select，textarea' ）;
	} ;


	/ **
	 *在触摸端，确定是否一次发送点击事件。
	 *
	 * @param { 事件 }事件
	 * @returns { 布尔 }
	 * /
	快速点击。原型。onTouchEnd  =  函数（事件） {
		var  forElement ， trackingClickStart ， targetTagName ， scrollParent ， touch ， targetElement  =  this 。targetElement ;

		如果 （！此。trackingClick ） {
			返回 true ;
		}

		//防止快速双击时幻像点击（问题＃36）
		如果 （（事件。的timeStamp  -  此。lastClickTime ） <  此。tapDelay ） {
			这个。cancelNextClick  =  true ;
			返回 true ;
		}

		如果 （（事件。的timeStamp  -  此。trackingClickStart ） >  此。tapTimeout ） {
			返回 true ;
		}

		//重置以防止错误单击取消输入（issue＃156）。
		这个。cancelNextClick  =  false ;

		这个。lastClickTime  =  事件。timeStamp ;

		trackingClickStart  =  this 。trackingClickStart ;
		这个。trackingClick  =  false ;
		这个。trackingClickStart  =  0 ;

		//在某些iOS设备上，如果事件层提供的targetElement无效，
		//正在执行过渡或滚动，必须手动重新检测。注意
		//为了使其正常运行，必须在检查事件目标后*之后将其调用！
		//参见问题＃57；也提交为rdar：// 13048589。
		如果 （deviceIsIOSWithBadTarget ） {
			touch  =  事件。changedTouches [ 0 ] ；

			//在某些情况下elementFromPoint的参数可以为负，因此请避免将targetElement设置为null
			targetElement  =  document 。elementFromPoint （触摸。pageX属性 -  窗口。pageXOffset ， 触摸。pageY  -  窗口。pageYOffset ） ||  targetElement ;
			targetElement 。fastClickScrollParent  =  this 。targetElement 。fastClickScrollParent ;
		}

		targetTagName  =  targetElement 。tagName 。toLowerCase （）;
		如果 （targetTagName  ===  'label' ） {
			forElement  =  this 。findControl （targetElement ）;
			如果 （forElement ） {
				这个。焦点（targetElement ）;
				如果 （deviceIsAndroid ） {
					返回 false ;
				}

				targetElement  =  forElement ;
			}
		}  否则 如果 （这个。needsFocus （targetElement ）） {

			//情况1：如果触摸是在不久前开始的（根据对问题36的测试，最佳猜测是100毫秒），则无论如何都会触发焦点。尽早返回并取消设置目标元素引用，以便允许后续单击。
			//情况2：如果在iframe中包含文档时点击的输入元素没有此例外，那么即使value属性随用户类型而更新（issue＃37），输入的文本也将不可见。
			如果 （（事件。的timeStamp  -  trackingClickStart ） >  100  ||  （deviceIsIOS  &&  窗口。顶部 ==！窗口 &&  targetTagName  ===  '输入' ）） {
				这个。targetElement  =  null ;
				返回 false ;
			}

			这个。焦点（targetElement ）;
			这个。sendClick （targetElement ， event ）;

			//选择元素需要事件在iOS 4上通过，否则选择器菜单将不会打开。
			//当VoiceOver在iOS6，iOS7（可能还有其他）上处于活动状态时，这也会破坏打开选择
			如果 （！deviceIsIOS  ||  targetTagName！== 'select' ） {
				这个。targetElement  =  null ;
				事件。preventDefault （）;
			}

			返回 false ;
		}

		如果 （deviceIsIOS  &&！deviceIsIOS4 ） {

			//如果目标元素包含在已滚动的父层中，则不要发送合成点击事件
			//并且此水龙头用于停止滚动（通常由猛击引发-问题＃42）。
			scrollParent  =  targetElement 。fastClickScrollParent ;
			如果 （scrollParent  &&  scrollParent 。fastClickLastScrollTop！== scrollParent 。scrollTop的） {
				返回 true ;
			}
		}

		//阻止实际点击-除非目标节点被标记为要求
		//实际点击，或者如果在允许列表中，则仅允许非程序性点击。
		如果 （！此。needsClick （targetElement ）） {
			事件。preventDefault （）;
			这个。sendClick （targetElement ， event ）;
		}

		返回 false ;
	} ;


	/ **
	 *触摸取消时，停止跟踪点击。
	 *
	 * @returns { void }
	 * /
	快速点击。原型。onTouchCancel  =  函数（） {
		这个。trackingClick  =  false ;
		这个。targetElement  =  null ;
	} ;


	/ **
	 *确定应允许的鼠标事件。
	 *
	 * @param { 事件 }事件
	 * @returns { 布尔 }
	 * /
	快速点击。原型。onMouse  =  函数（事件） {

		//如果从未设置目标元素（因为从未触发过触摸事件），请允许该事件
		如果 （！此。targetElement ） {
			返回 true ;
		}

		如果 （事件。forwardedTouchEvent ） {
			返回 true ;
		}

		//应该允许以编程方式生成的针对特定元素的事件
		如果 （！事件。可取消） {
			返回 true ;
		}

		//派生并检查目标元素，以查看是否需要允许鼠标事件；
		//除非明确启用，否则请避免非触摸式点击事件触发操作，
		//防止虚影/双击。
		如果 （！此。needsClick （此。targetElement ） ||  此。cancelNextClick ） {

			//防止触发任何在FastClick元素上声明的用户添加的侦听器。
			如果 （事件。stopImmediatePropagation ） {
				事件。stopImmediatePropagation （）;
			}  其他 {

				//不支持Event＃stopImmediatePropagation（例如Android 2）的浏览器的部分hack
				事件。传播停止 =  真;
			}

			//取消活动
			事件。stopPropagation （）;
			事件。preventDefault （）;

			返回 false ;
		}

		//如果允许鼠标事件，则返回true以使操作通过。
		返回 true ;
	} ;


	/ **
	 *在实际点击次数上，确定这是否是触摸生成的点击，发生点击动作
	 *触摸后自然延迟（需要取消操作以避免重复），或者
	 *应该允许的实际点击。
	 *
	 * @param { 事件 }事件
	 * @returns { 布尔 }
	 * /
	快速点击。原型。onClick  =  函数（事件） {
		 允许var ;

		//随第三方代码一起提供的另一个类似FastClick的库有可能在FastClick之前触发click事件（问题＃44）。在这种情况下，请将点击跟踪标记设置回false并尽早返回。这将导致onTouchEnd提前返回。
		如果 （此。trackingClick ） {
			这个。targetElement  =  null ;
			这个。trackingClick  =  false ;
			返回 true ;
		}

		//在iOS上的行为很奇怪（第18个问题）：如果表单中存在一个Submit元素，并且用户在iOS模拟器中按下Enter键，或者在弹出的OS键盘上单击Go按钮，这是一种“伪造” click事件将以Submit-type输入元素为目标来触发。
		如果 （事件。目标。键入 ===  '提交'  &&  事件。详细 ===  0 ） {
			返回 true ;
		}

		允许 =  this 。onMouse （事件）;

		//如果不允许点击，则仅取消设置targetElement。这将确保对onMouse中的！targetElement的检查失败，并且浏览器不会单击。
		如果 （！允许） {
			这个。targetElement  =  null ;
		}

		//如果允许点击，请返回true以使操作通过。
		 允许退货;
	} ;


	/ **
	 *删除所有FastClick的事件侦听器。
	 *
	 * @returns { void }
	 * /
	快速点击。原型。销毁 =  功能（） {
		var  layer  =  this 。层;

		如果 （deviceIsAndroid ） {
			层。removeEventListener （'鼠标悬停' ， 此。onMouse ， 真）;
			层。removeEventListener （'鼠标按下' ， 此。onMouse ， 真）;
			层。removeEventListener （'鼠标松开' ， 此。onMouse ， 真）;
		}

		层。removeEventListener （'点击' ， 这。的onClick ， 真正的）;
		层。removeEventListener （'touchstart' ， 此。onTouchStart ， 假）;
		层。removeEventListener （'touchmove' ， 此。onTouchMove ， 假）;
		层。removeEventListener （'touchend' ， 此。onTouchEnd ， 假）;
		层。removeEventListener （'touchcancel' ， 此。onTouchCancel ， 假）;
	} ;


	/ **
	 *检查是否需要FastClick。
	 *
	 * @param { Element } layer监听的层
	 * /
	快速点击。notNeeded  =  函数（层） {
		var  metaViewport ;
		var  chromeVersion ;
		var  blackberryVersion ;
		var  firefoxVersion ;

		//不支持触摸的设备不需要FastClick
		如果 （typeof运算 窗口。ontouchstart  ===  '未定义' ） {
			返回 true ;
		}

		// Chrome版本-其他浏览器为零
		chromeVersion  =  + （/铬\ / （[ 0-9 ] + ） / 。EXEC （导航。的userAgent ） ||  [ ，0 ] ）[ 1 ] ;

		如果 （chromeVersion ） {

			如果 （deviceIsAndroid ） {
				metaViewport  =  文档。querySelector （'meta [name = viewport]' ）;

				如果 （metaViewport ） {
					// Android（用户可缩放=“否”）上的Chrome不需要FastClick（问题＃89）
					如果 （metaViewport 。内容。的indexOf （'用户可扩展=无' ） ==！- 1 ） {
						返回 true ;
					}
					//宽度等于或小于设备宽度的Chrome 32及更高版本不需要FastClick
					如果 （chromeVersion  >  31  &&  文件。documentElement 。scrollWidth <= 窗口。outerWidth ） {
						返回 true ;
					}
				}

			// Chrome桌面不需要FastClick（第15个问题）
			}  其他 {
				返回 true ;
			}
		}

		如果 （deviceIsBlackBerry10 ） {
			blackberryVersion  =  导航器。userAgent 。匹配（/版本\ / （[ 0-9 ] * ）\。（[ 0-9 ] * ） / ）;

			// BlackBerry 10.3+不需要Fastclick库。
			// https://github.com/ftlabs/fastclick/issues/251
			if  （blackberryVersion [ 1 ] > = 10  &&  blackberryVersion [ 2 ] > = 3 ） {
				metaViewport  =  文档。querySelector （'meta [name = viewport]' ）;

				如果 （metaViewport ） {
					// user-scalable = no消除点击延迟。
					如果 （metaViewport 。内容。的indexOf （'用户可扩展=无' ） ==！- 1 ） {
						返回 true ;
					}
					// width = device-width（或小于device-width）可消除点击延迟。
					如果 （文件。documentElement 。scrollWidth <= 窗口。outerWidth ） {
						返回 true ;
					}
				}
			}
		}

		//带有-ms-touch-action的IE10：无操作或可操作，可禁用双击放大功能（问题＃97）
		如果 （层。样式。msTouchAction  ===  '无'  ||  层。样式。touchAction  ===  '操作' ） {
			返回 true ;
		}

		// Firefox版本-其他浏览器为零
		firefoxVersion  =  + （/火狐\ / （[ 0-9 ] + ） / 。EXEC （导航。的userAgent ） ||  [ ，0 ] ）[ 1 ] ;

		如果 （firefoxVersion > = 27 ） {
			//如果内容不可缩放，Firefox 27+没有点击延迟-https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport  =  文档。querySelector （'meta [name = viewport]' ）;
			如果 （metaViewport  &&  （metaViewport 。内容。的indexOf （'用户可扩展=无' ） ==！- 1个 ||  文件。documentElement 。scrollWidth <= 窗口。outerWidth ）） {
				返回 true ;
			}
		}

		// IE11：不再支持带前缀的-ms-touch-action，建议使用非前缀版本
		// http://msdn.microsoft.com/zh-CN/library/windows/apps/Hh767313.aspx
		如果 （层。样式。touchAction  ===  '无'  ||  层。样式。touchAction  ===  '操作' ） {
			返回 true ;
		}

		返回 false ;
	} ;


	/ **
	 *用于创建FastClick对象的工厂方法
	 *
	 * @param { Element } layer监听的层
	 * @param { Object } [options = {}]覆盖默认值的选项
	 * /
	快速点击。附加 =  功能（层， 选项） {
		返回 新的 FastClick （层， 选项）;
	} ;


	如果 （typeof运算 定义 ===  '功能'  &&  typeof运算 定义。AMD  ===  '对象'  &&  限定。AMD ） {

		// AMD。注册为匿名模块。
		定义（函数（） {
			返回 FastClick ;
		} ）;
	}  否则 如果 （typeof运算 模块！== '不确定'  &&  模块。出口） {
		模块。出口 =  FastClick 。附上;
		模块。出口。FastClick  =  快速点击；
	}  其他 {
		窗口。FastClick  =  快速点击；
	}
} （））;