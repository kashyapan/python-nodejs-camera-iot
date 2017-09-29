import requests
import time
import json
import cam
import os

abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)

image_dir = dname+'/images/'


def routine(link):
	while True:
		try:
			tgt_link = link+'/status'
			r = requests.get(tgt_link)
		except:
			print("No Connection or server down Trying in 5 Seconds..")
			time.sleep(5)	
			continue	
		
		data =  r.json()

		j_data = json.loads(data)

	
		if j_data['status'] == True:
			#call function to switch ON camera
			name = cam.dateName(image_dir)
			cam.takeSnap(name)			
			print "Snapshot take stored at "
			print name 
			# send it to server
			leafname = os.path.basename(name)
			leafname += '.png'
			name += ".png"
			files = {'filetoupload': (leafname, open(name, 'rb'))}
			img_link = link+'/upload'
			r = requests.post(img_link, files=files)
			print r.text
		else:
			#call function to switch OFF camera		
			print "Camera is OFF"
	
	
		time.sleep(0.1)
