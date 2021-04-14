import sys
import json
import pandas as pd
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import os
import base64


def main():
    # getting the array of report dates
    argv_tmp = eval(sys.argv[1])
    if type(argv_tmp) == int:
        dates_ts = [argv_tmp]
    else:
        dates_ts = list(argv_tmp)

    dates_temp = pd.Series([datetime.fromtimestamp(float(date)).date()
                           for date in dates_ts])
    occurences = dates_temp.value_counts().to_dict()

    dates = []
    frequency = []

    # creating arrays of dates and occurences of them
    end = dates_temp.max()
    date = dates_temp.min()
    while date <= end:
        dates.append(date)
        if date in occurences:
            frequency.append(occurences[date])
        else:
            frequency.append(0)
        date += timedelta(days=1)

    # plotting the report frequency
    figure = plt.figure(figsize=(9, 5))
    plt.plot(dates, frequency, 'b-o')

    plt.xlabel("Date")
    plt.ylabel("Number of reports")

    # make the y ticks integers, not floats
    yint = []
    locs, _ = plt.yticks()
    for each in locs:
        yint.append(int(each))
    plt.yticks(yint)
    plt.title('Report frequency')

    file_name = "freq.jpg"
    figure.savefig(file_name)

    with open(file_name, 'rb') as img:
        data = base64.b64encode(img.read())
    os.remove(file_name)

    print(data)

    # Start process
if __name__ == '__main__':
    main()
