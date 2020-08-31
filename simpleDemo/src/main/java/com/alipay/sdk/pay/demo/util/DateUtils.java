package com.alipay.sdk.pay.demo.util;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SuppressWarnings("unchecked")
public class DateUtils
{

	public static String getEndYM(String beginYM, String num) throws ParseException
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
		Calendar ym = Calendar.getInstance();
		Date date = sdf.parse(beginYM);
		ym.setTime(date);
		int i = Integer.parseInt(num);
		ym.add(Calendar.MONTH, i);
		Date d = ym.getTime();
		return sdf.format(d);

	}

	public static String getEndYMWithLine(String beginYM, String num) throws ParseException
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		Calendar ym = Calendar.getInstance();
		ym.setTime(sdf.parse(beginYM));
		int i = Integer.parseInt(num);
		ym.add(Calendar.MONTH, i);
		Date d = ym.getTime();
		return sdf.format(d);

	}

	public static String[] getSSQ(String yyyymm, int i) throws ParseException
	{
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMM");
		SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
		String[] ssq = new String[2];
		Calendar ym = Calendar.getInstance();
		ym.setTime(sdf1.parse(yyyymm));
		ym.add(Calendar.MONTH, i + 1);
		ym.add(Calendar.DAY_OF_MONTH, -1);
		Date d = ym.getTime();
		String lastDay = sdf2.format(d);
		String firstDay = lastDay.substring(0, 8) + "01";
		ssq[0] = firstDay;
		ssq[1] = lastDay;
		return ssq;
	}

	public static Date getSSQDate(String yyyymm, int i) throws ParseException
	{
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMM");
		Calendar ym = Calendar.getInstance();
		ym.setTime(sdf1.parse(yyyymm));
		ym.add(Calendar.MONTH, i);
		ym.add(Calendar.DAY_OF_MONTH, ym.getActualMinimum(Calendar.DAY_OF_MONTH) - 1);
		Date d = ym.getTime();
		return d;
	}

	public static String getBeforeTime(String yyyyMMddHHmmss, String num) throws ParseException
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Calendar ym = Calendar.getInstance();
		ym.setTime(sdf.parse(yyyyMMddHHmmss));
		int i = Integer.parseInt(num);
		ym.add(Calendar.MINUTE, -i);
		Date d = ym.getTime();
		return sdf2.format(d);
	}

	public static Date getAfterTimeByDate(String yyyyMMddHHmmss, String num) throws ParseException
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		Calendar ym = Calendar.getInstance();
		ym.setTime(sdf.parse(yyyyMMddHHmmss));
		int i = Integer.parseInt(num);
		ym.add(Calendar.MINUTE, i);
		Date d = ym.getTime();
		return d;
	}

	public static String[] initSSQ(String m, String y)
	{
		String[] ssqs = new String[2];
		ssqs[0] = y + "-" + m + "-01";
		ssqs[1] = y + "-" + m + "-" + getLastDayOfMonth(y, m);
		return ssqs;
	}

	public static Set<String> month31Set = new HashSet<String>();

	static
	{
		month31Set.add("01");
		month31Set.add("03");
		month31Set.add("05");
		month31Set.add("07");
		month31Set.add("08");
		month31Set.add("10");
		month31Set.add("12");
	}

	public static Set<String> month30Set = new HashSet<String>();

	static
	{
		month30Set.add("04");
		month30Set.add("06");
		month30Set.add("09");
		month30Set.add("11");
	}

	public static String getYYYYMMDD(String yyyy_mm_dd)
	{
		String yyyymmdd = null;
		String[] strs = yyyy_mm_dd.split("-");
		if (strs.length == 3)
		{
			yyyymmdd = strs[0] + strs[1] + strs[2];
		} else
		{
			yyyymmdd = yyyy_mm_dd;
		}

		return yyyymmdd.substring(0, 8);
	}

	public static String getYYYY_MM_DD(String yyyymmdd)
	{
		String yyyy_mm_dd = null;
		if (yyyymmdd.length() == 8)
		{
			yyyy_mm_dd = yyyymmdd.substring(0, 4) + "-" + yyyymmdd.substring(4, 6) + "-" + yyyymmdd.substring(6, 8);
		} else
		{
			yyyy_mm_dd = yyyymmdd;
		}
		return yyyy_mm_dd.substring(0, 10);
	}

	public static String getLastDayOfMonth(String year, String mm)
	{

		if ("02".equals(mm))
		{
			int y = Integer.parseInt(year);
			Calendar calendar = Calendar.getInstance();
			boolean b = ((GregorianCalendar) calendar).isLeapYear(y);
			if (b)
			{
				return "29";
			}
			return "28";
		} else if (month30Set.contains(mm))
		{
			return "30";
		} else if (month31Set.contains(mm))
		{
			return "31";
		} else
		{
			return "";
		}
	}

	public static String getLastDayOfMonth(String yyyymm)
	{
		String year = yyyymm.substring(0, 4);
		String mm = yyyymm.substring(4, 6);
		if ("02".equals(mm))
		{
			int y = Integer.parseInt(year);
			Calendar calendar = Calendar.getInstance();
			boolean b = ((GregorianCalendar) calendar).isLeapYear(y);
			if (b)
			{
				return "29";
			}
			return "28";
		} else if (month30Set.contains(mm))
		{
			return "30";
		} else if (month31Set.contains(mm))
		{
			return "31";
		} else
		{
			return "";
		}
	}

	public static String formateDateYYYY_MM_DD(String yyyy_mm_dd)
	{
		String[] arrays = yyyy_mm_dd.split("-");
		if (arrays[1].length() == 1)
		{
			arrays[1] = "0" + arrays[1];
		}
		if (arrays[2].length() == 1)
		{
			arrays[2] = "0" + arrays[2];
		}
		yyyy_mm_dd = arrays[0] + "-" + arrays[1] + "-" + arrays[2];
		return yyyy_mm_dd.substring(0, 10);
	}

	public static void main(String[] args)
	{
		// System.out.println(getAfterTimeByDate("20120810101010", "120"));
//		System.out.println(initSSQ("10", "2013")[0] + "  " + initSSQ("10", "2013")[1]);
		System.out.println(getSysDateStr(6));
	}

	private static SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMdd");

	private static SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");

	private static SimpleDateFormat sdf3 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

	private static SimpleDateFormat sdf4 = new SimpleDateFormat("yyyyMMddHHmmss");

	private static SimpleDateFormat sdf5 = new SimpleDateFormat("yyyyMM");

	private static SimpleDateFormat sdf6 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	/**
	 * Created on Oct 25, 2008
	 * <p>
	 * 鍙栧緱绯荤粺鏃ユ湡
	 * </p>
	 * 
	 * @return
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕[Email]
	 */
	public static Date getSysDate()
	{
		return Calendar.getInstance().getTime();
	}

	public static String getSysDateStr(int i)
	{

		return formateDate(getSysDate(), i);
	}

	public static String getSysDateStr()
	{

		return formateDate(getSysDate(), 4);
	}

	/**
	 * Created on Oct 26, 2008
	 * <p>
	 * 鏍煎紡鍖栨棩鏈�
	 * </p>
	 * 
	 * @param date
	 * @param style
	 * @return
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕[Email]
	 */
	public static String formateDate(Date date, int style)
	{
		switch (style)
		{
		case 1:
			return sdf1.format(date);
		case 2:
			return sdf2.format(date);
		case 3:
			return sdf3.format(date);
		case 4:
			return sdf4.format(date);
		case 5:
			return sdf5.format(date);
		case 6:
			return sdf6.format(date);
		default:
			return sdf1.format(date);
		}
	}

	/**
	 * Created on 2008-11-24
	 * <p>
	 * Description:
	 * </p>
	 * 
	 * @param date
	 * @return
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕[Email]
	 */
	public static String formateString8Date(String date)
	{
		String _date = null;
		if (date == null || "".equals(date))
		{
			return "";
		}
		_date = date.replaceAll("-", "").substring(0, 8);
		return _date;
	}

	/**
	 * Created on 2008-10-28
	 * <p>
	 * Description:[灏哠tring绫诲瀷鐨勬椂闂村瓧绗︿覆杞崲鎴愭寚瀹氭牸寮忕殑Date]
	 * </p>
	 * 
	 * @param date
	 * @param style
	 * @return
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕[Email]
	 */
	public static Date getDate(String date, int style)
	{
		try
		{
			switch (style)
			{
			case 1:
				return sdf1.parse(date);
			case 2:
				return sdf2.parse(date);
			case 3:
				return sdf3.parse(date);
			default:
				return sdf1.parse(date);
			}
		} catch (ParseException e)
		{
			;
		}
		return null;
	}

	/**
	 * Created on 2008-11-17
	 * <p>
	 * Description:
	 * </p>
	 * 
	 * @param date
	 * @param type
	 * @param step
	 * @return
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕[Email]
	 */
	public static Date getDateAdded(Date date, int type, int step)
	{
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		c.add(type, step);
		return c.getTime();
	}

	/**
	 * Created on 2008-12-25
	 * <p>
	 * Description:
	 * </p>
	 * 
	 * @param date
	 * @param type
	 * @param step
	 * @return
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕[Email]
	 */
	public static String getDateAdded(String date, int type, int step)
	{
		Date _date = getDate(date);
		return formatDate(getDateAdded(_date, type, step));
	}

	/**
	 * Created on Oct 25, 2008
	 * <p>
	 * Description:[鏂规硶鍔熻兘涓枃鎻忚堪]
	 * </p>
	 * 
	 * @param str
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕[Email]
	 */
	public static Date getDate(String str)
	{
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		try
		{
			return df.parse(str);
		} catch (Exception e)
		{
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * Created on Oct 25, 2008
	 * <p>
	 * Description:[鏂规硶鍔熻兘涓枃鎻忚堪]
	 * </p>
	 * 
	 * @param nowDate
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕[Email]
	 */
	public static String getEndDateFromZDMonth(String[] nowDate)
	{
		String year = nowDate[0];
		String month = nowDate[1];

		String endDate = year + "-" + month + "-";
		if (month.equals("04") || month.equals("06") || month.equals("09") || month.equals("11"))
		{
			endDate = endDate + "30";
		} else if (month.equals("02"))
		{
			if (Integer.parseInt(year) % 4 == 0
					&& (Integer.parseInt(year) % 100 != 0 || Integer.parseInt(year) % 400 == 0))
			{
				endDate = endDate + "29";
			} else
			{
				endDate = endDate + "28";
			}
		} else
		{
			endDate = endDate + "31";
		}
		return endDate;
	}

	/**
	 * Created on 2005-3-17
	 * <p>
	 * Discription:[鏂规硶鍔熻兘涓枃鎻忚堪]
	 * </p>
	 * 
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕
	 * @return String .
	 */
	public static String getWhereIn(String inStr, String[] s)
	{
		if (s == null || s.length == 0)
		{
			return "1=1";
		}
		StringBuffer sb = new StringBuffer(inStr + " IN('");
		for (int i = 0; i < s.length; i++)
		{
			sb.append(s[i] + "','");
		}
		int end = sb.length();
		sb.delete(end - 2, end);
		sb.append(")");
		return sb.toString();
	}

	/**
	 * Created on 2005-3-17
	 * <p>
	 * Discription:[鏂规硶鍔熻兘涓枃鎻忚堪]
	 * </p>
	 * 
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕
	 * @return String .
	 */

	@SuppressWarnings("rawtypes")
	public static String getWhereIn(String inStr, List list)
	{
		int size = list.size();
		String s[] = new String[size];
		for (int i = 0; i < size; i++)
		{
			s[i] = (String) list.get(i);
		}
		return getWhereIn(inStr, s);
	}

	/**
	 * Created on 2005-3-17
	 * <p>
	 * Discription:[鏂规硶鍔熻兘涓枃鎻忚堪]
	 * </p>
	 * 
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕
	 * @return String[] .
	 */
	@SuppressWarnings("rawtypes")
	public static String[] listToStrings(List list)
	{
		String[] s = new String[list.size()];
		for (int i = 0; i < s.length; i++)
		{
			s[i] = (String) list.get(i);
		}
		return s;
	}

	/**
	 * Created on 2005-3-17
	 * <p>
	 * Discription:[鏂规硶鍔熻兘涓枃鎻忚堪]
	 * </p>
	 * 
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕
	 * @return List .
	 */
	@SuppressWarnings("rawtypes")
	public static List stringsToList(String[] s)
	{
		List list = new ArrayList();
		for (int i = 0; i < s.length; i++)
		{
			list.add(s[i]);
		}
		return list;
	}

	/**
	 * Created on 2005-3-17
	 * <p>
	 * Discription:[鏂规硶鍔熻兘涓枃鎻忚堪]
	 * </p>
	 * 
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕
	 * @return int .
	 */
	public static int deDate(Date sbrq, Date zh)
	{
		Calendar c1 = Calendar.getInstance();
		String d[] = formatDate(sbrq).split("-");
		int dd[] = new int[3];
		dd[0] = Integer.parseInt(d[0]);
		dd[1] = Integer.parseInt(d[1]);
		dd[2] = Integer.parseInt(d[2]);
		c1.set(Calendar.YEAR, dd[0]);
		c1.set(Calendar.MONTH, dd[1] - 1);
		c1.set(Calendar.DAY_OF_MONTH, dd[2]);
		c1.set(Calendar.HOUR_OF_DAY, 0);
		c1.set(Calendar.MINUTE, 0);
		c1.set(Calendar.SECOND, 0);

		Calendar c2 = Calendar.getInstance();
		d = formatDate(zh).split("-");
		dd = new int[3];
		dd[0] = Integer.parseInt(d[0]);
		dd[1] = Integer.parseInt(d[1]);
		dd[2] = Integer.parseInt(d[2]);
		c2.set(Calendar.YEAR, dd[0]);
		c2.set(Calendar.MONTH, dd[1] - 1);
		c2.set(Calendar.DAY_OF_MONTH, dd[2]);
		c2.set(Calendar.HOUR_OF_DAY, 0);
		c2.set(Calendar.MINUTE, 0);
		c2.set(Calendar.SECOND, 0);

		int n = (int) ((c1.getTimeInMillis()) / (24 * 60 * 60 * 1000))
				- (int) ((c2.getTimeInMillis()) / (24 * 60 * 60 * 1000));
		return n;
	}

	/**
	 * Created on 2005-3-17
	 * <p>
	 * Discription:[鏂规硶鍔熻兘涓枃鎻忚堪]
	 * </p>
	 * 
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕
	 * @return int .
	 */
	public static int deDate(String q, String z)
	{
		return deDate(getDate(q), getDate(z));
	}

	/**
	 * Created on 2005-3-17
	 * <p>
	 * Discription:[鏂规硶鍔熻兘涓枃鎻忚堪]
	 * </p>
	 * 
	 * @author:璧电户骞砙zhaojp@neusoft.com]
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕
	 * @return String .
	 */
	public static String formatDate(Date date)
	{
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		return df.format(date);
	}

	public static String[] getWholeYear()
	{
		String[] ssqs = new String[2];
		String year = getSysDateStr(1).substring(0, 4);
		ssqs[0] = year + "-01-01";
		ssqs[1] = year + "-01-31";
		return ssqs;

	}

	public static String[] getOneYearFromNow() throws ParseException
	{
		String date = getSysDateStr(2);
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM");
		SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
		String[] ssq = new String[2];
		Calendar q = Calendar.getInstance();
		q.setTime(sdf1.parse(date));
		q.add(Calendar.MONTH, 1);
		q.add(Calendar.DAY_OF_MONTH, -1);
		Calendar z = Calendar.getInstance();

		z.setTime(sdf1.parse(date.substring(0, 7) + "-01"));
		z.add(Calendar.MONTH, -11);

		String lastDay = sdf2.format(q.getTime());
		String firstDay = sdf1.format(z.getTime()) + "-01";
		ssq[0] = firstDay;
		ssq[1] = lastDay;
		return ssq;

	}

	/**
	 * <p>
	 * Discription:[寰楀埌涓�釜鏃ユ湡鎵�湪鏈堢殑鏈�悗涓�ぉ,鏃ユ湡鏍煎紡涓篩YYY-MM-DD]
	 * </p>
	 * 
	 * @param date
	 * @return
	 * @author:[John]
	 * @insert:2008-5-26
	 * @update:[鏃ユ湡YYYY-MM-DD] [鏇存敼浜哄鍚峕[鍙樻洿鎻忚堪]
	 */
	public static String getMonthLastDay(String date)
	{

		int getYear = Integer.parseInt(date.substring(0, 4));
		int getMonth = Integer.parseInt(date.substring(5, 7));
		int lastDay;

		if (getMonth == 2)
		{
			if (getYear % 4 == 0 && getYear % 100 != 0 || getYear % 400 == 0)
			{
				lastDay = 29;
			} else
			{
				lastDay = 28;
			}
		} else if (getMonth == 4 || getMonth == 6 || getMonth == 9 || getMonth == 11)
		{
			lastDay = 30;
		} else
		{
			lastDay = 31;
		}
		String nextMonth = Integer.toString(getMonth);
		for (int i = 1; i < 10; i++)
		{
			if (Integer.parseInt(nextMonth) == i)
			{
				nextMonth = "0" + nextMonth;
			}
		}
		String nextDay = Integer.toString(lastDay);
		for (int i = 1; i < 10; i++)
		{
			if (Integer.parseInt(nextDay) == i)
			{
				nextDay = "0" + nextDay;
			}
		}
		String lastDate = getYear + "-" + nextMonth + "-" + nextDay;
		return lastDate;
	}

}
