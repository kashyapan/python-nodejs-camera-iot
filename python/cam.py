import time
import cv2
import datetime

def takeSnap(name):
	camera_port = 0
	name += ".png" 
	camera = cv2.VideoCapture(camera_port)
	time.sleep(0.2)  # If you don't wait, the image will be dark
	return_value, image = camera.read()
	cv2.imwrite(name, image)
	del(camera)  # so that others can use the camera as soon as possible
	
def dateName(dirc):

	name = dirc
	name += datetime.datetime.today().strftime('%Y%m%d')
	name += str(time.time())
	
	return name
