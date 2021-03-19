import sys
import json

# Read data from stdin


def main():

    userId = sys.argv[1]
    topicId = sys.argv[2]
    res = {"userid": userId, "topicid": topicId}
    print(json.dumps(res))


# Start process
if __name__ == '__main__':
    main()
