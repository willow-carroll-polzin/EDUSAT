#Required Libriaries
from tkinter import *
from tkinter.ttk import *

###################### GUI Setup ######################
#Initilize the window
window = Tk()

window.title("EDU-SAT System Monitor")
window.geometry('1000x600')
window.iconbitmap(default='transparent.ico')

#lab = Label(window, text='Window with transparent icon.')
#lab.pack()

###################### GUI Layout ######################
#       SYSTEM STATUS       #
#Setup the labels
lbl = Label(window, text="System Status", font=("Arial Bold", 50))
lbl.grid(column=0, row=0)

#       FILE MANAGER       #
#Event handlers
def clicked():
    input = "Was typed:"+txt.get()
    lbl.configure(text=input)

#Setup buttons
btn = Button(window, text="Click Me", bg="orange", fg="red", command=clicked)
btn.grid(column=1, row=0)

#Textbox
txt = Entry(window,width=10)
txt.grid(column=2, row=0)


#       GRAPHER       #

###################### GUI Controls ######################
#Run the window
window.mainloop()
